import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserReq } from 'src/const/const';
import { JWT_EXPIRED, JWT_SECRET } from 'src/const/jwt.const';
import { User } from 'src/database/entity/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtCoreService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRED: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_SECRET = this.configService.get<string>(JWT_SECRET);
    this.JWT_EXPIRED = this.configService.get<number>(JWT_EXPIRED);
    console.log(this.JWT_SECRET, this.JWT_EXPIRED);
  }

  signAccessToken(user: User) {
    const payload = { id: user.id, jti: randomUUID() };
    const token = this.jwtService.sign(JSON.stringify(payload), {
      secret: this.JWT_SECRET,
    });

    return {
      accessToken: token,
      expiredAccessTokenAt: new Date(Date.now() + this.JWT_EXPIRED * 1),
    };
  }

  signRefreshToken(user: User) {
    const payload = { id: user.id, jti: randomUUID() };
    const token = this.jwtService.sign(JSON.stringify(payload), {
      secret: this.JWT_SECRET,
    });
    return {
      refreshToken: token,
      expiredRefreshTokenAt: new Date(Date.now() + this.JWT_EXPIRED * 5),
    };
  }

  verify(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.JWT_SECRET,
    });
    const user: UserReq = payload;
    return user;
  }
}
