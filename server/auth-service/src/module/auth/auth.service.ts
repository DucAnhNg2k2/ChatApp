import { AuthRepository } from './auth.repository';
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { AuthRegisterEmailDto } from './dto/auth-register-email.dto';
import { UserReq, UserType, VerifyOTPType } from 'src/const/const';
import { Repository } from 'typeorm';
import { UserOtp } from 'src/database/entity/user-otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { LoginDto } from './dto/login.dto';
import { UserToken } from 'src/database/entity/user-token.entity';
import { JwtCoreService } from '../jwt/jwt.core.service';

@Injectable()
export class AuthService {
  private TIME_EXPIRED_OTP = 5 * 60 * 1000;

  constructor(
    private readonly queueService: QueueService,
    private readonly authRepository: AuthRepository,
    @InjectRepository(UserOtp)
    private readonly userOtpRepository: Repository<UserOtp>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
    private readonly jwtService: JwtCoreService,
  ) {}

  async register(authRegisterEmailDto: AuthRegisterEmailDto) {
    const findOneByEmail = await this.authRepository.findOneByEmail(
      authRegisterEmailDto.email,
    );
    if (findOneByEmail) {
      throw new BadRequestException('Email already exists');
    }

    authRegisterEmailDto.type = UserType.EMAIL;

    const user = await this.authRepository.insert(authRegisterEmailDto);
    if (!user) {
      throw new BadRequestException('Failed to register user');
    }

    const otp = this.randomOtp();
    await this.userOtpRepository.insert({
      user,
      otp,
      expiredAt: new Date(Date.now() + this.TIME_EXPIRED_OTP).toISOString(),
      type: VerifyOTPType.REGISTER,
    });

    await this.queueService.sendMain({
      to: [authRegisterEmailDto.email],
      subject: 'Register Success',
      text: `Mã OTP của bạn là ${otp}. Mã này sẽ hết hạn sau 5 phút.`,
    });
    return true;
  }

  async verifyOtp(verifyOtp: VerifyOtpDto) {
    const userOtp = await this.userOtpRepository.findOne({
      where: {
        otp: verifyOtp.otp,
        type: verifyOtp.type,
        user: {
          email: verifyOtp.email,
        },
      },
      relations: ['user'],
    });

    if (!userOtp) {
      throw new BadRequestException('Invalid OTP');
    }
    if (new Date(userOtp.expiredAt) < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    await this.authRepository.updateActive(userOtp.user.id);
    return true;
  }

  async resendOtp(resendVerifyOtp: ResendOtpDto) {
    const userOtp = await this.userOtpRepository.findOne({
      where: {
        user: {
          email: resendVerifyOtp.email,
        },
      },
    });

    if (!userOtp) {
      throw new BadRequestException('Email not found');
    }
    const newOtp = this.randomOtp();
    await this.userOtpRepository.update(userOtp.id, {
      otp: newOtp,
      expiredAt: new Date(Date.now() + this.TIME_EXPIRED_OTP).toISOString(),
    });
    await this.queueService.sendMain({
      to: [resendVerifyOtp.email],
      subject: resendVerifyOtp.type,
      text: `Mã OTP của bạn là ${newOtp}. Mã này sẽ hết hạn sau 5 phút.`,
    });
    return true;
  }

  async login(loginDto: LoginDto) {
    if (loginDto.type !== UserType.EMAIL) {
      throw new BadRequestException('Invalid type');
    }

    const user = await this.authRepository.findOneByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    if (!user.isActive) {
      throw new BadRequestException('Account is not active');
    }
    if (user.password !== loginDto.password) {
      throw new BadRequestException('Invalid password');
    }

    const { accessToken, expiredAccessTokenAt } =
      this.jwtService.signAccessToken(user);
    const { refreshToken, expiredRefreshTokenAt } =
      this.jwtService.signRefreshToken(user);

    await this.userTokenRepository.insert({
      user,
      accessToken,
      refreshToken,
      expiredAccessTokenAt,
      expiredRefreshTokenAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private randomOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

  async verifyHeaderToken(token: string): Promise<UserReq> {
    const user: UserReq = this.jwtService.verify(token);
    const userToken = await this.userTokenRepository.findOne({
      where: {
        accessToken: token,
        userId: user.id,
      },
      relations: ['user'],
    });

    if (!userToken) {
      throw new BadRequestException('Invalid token');
    }
    if (new Date(userToken.expiredAccessTokenAt) < new Date()) {
      throw new BadRequestException('Token expired');
    }

    return {
      id: user.id,
    };
  }
}
