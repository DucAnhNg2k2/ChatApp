import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserOtp } from 'src/database/entity/user-otp.entity';
import { UserToken } from 'src/database/entity/user-token.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtServiceImplement } from './jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserOtp, UserToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtServiceImplement],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {}
}
