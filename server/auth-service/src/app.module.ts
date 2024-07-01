import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { QueueModule } from './module/queue/queue.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './database/entity/user.entity';
import { UserOtp } from './database/entity/user-otp.entity';
import { UserToken } from './database/entity/user-token.entity';
import { JwtCoreModule } from './module/jwt/jwt.core.module';
import {
  QUEUE_HOST,
  QUEUE_PASSWORD,
  QUEUE_PORT,
  QUEUE_USER,
} from './const/queue.const';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, UserOtp, UserToken],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    QueueModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        host: configService.get(QUEUE_HOST),
        port: configService.get(QUEUE_PORT),
        user: configService.get(QUEUE_USER),
        password: configService.get(QUEUE_PASSWORD),
      }),
      inject: [ConfigService],
    }),
    JwtCoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
