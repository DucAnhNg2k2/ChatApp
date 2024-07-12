import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { PATTERN, UserReq } from 'src/const/const';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from './auth.service';
import { AuthRegisterEmailDto } from './dto/auth-register-email.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UpdateMeDto } from './dto/update-me.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() authRegisterEmailDto: AuthRegisterEmailDto) {
    return this.authService.register(authRegisterEmailDto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('resend-otp')
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@User() user: UserReq) {
    return user;
  }

  @Put('me')
  @UseGuards(AuthGuard)
  updateMe(@User() user: UserReq, @Body() body: UpdateMeDto) {
    // return this.authService.updateMe(user, body);
  }

  @MessagePattern({ cmd: PATTERN.VERIFY_AUTH })
  verifyHeaderToken(token: string) {
    return this.authService.verifyHeaderToken(token);
  }
}
