import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  QUEUE_HOST,
  QUEUE_PASSWORD,
  QUEUE_PORT,
  QUEUE_USER,
} from './const/queue.const';
import { UserOtp } from './database/entity/user-otp.entity';
import { UserProfile } from './database/entity/user-profile.entity';
import { UserToken } from './database/entity/user-token.entity';
import { User } from './database/entity/user.entity';
import { AuthModule } from './module/auth/auth.module';
import { JwtCoreModule } from './module/jwt/jwt.core.module';
import { QueueModule } from './module/queue/queue.module';
import { UserProfileModule } from './module/user-profile/user-profile.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatService } from './const/const';

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
        entities: [User, UserOtp, UserToken, UserProfile],
        synchronize: false,
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
    UserProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
