import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtCoreModule } from '../jwt/jwt.core.module';
import { UserOtp } from 'src/database/entity/user-otp.entity';
import { UserToken } from 'src/database/entity/user-token.entity';
import { User } from 'src/database/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserOtp, UserToken])],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {
  constructor() {}
}
