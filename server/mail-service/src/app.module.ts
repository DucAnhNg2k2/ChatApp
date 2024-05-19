import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueModule } from './module/queue/queue.module';
import { MailModule } from './module/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    QueueModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('QUEUE_HOST'),
        port: +configService.get('QUEUE_PORT'),
        user: configService.get('QUEUE_USER'),
        password: configService.get('QUEUE_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
    MailModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('MAIL_HOST'),
        port: +configService.get('MAIL_PORT'),
        user: configService.get('MAIL_USER'),
        password: configService.get('MAIL_PASSWORD'),
        secure: configService.get('MAIL_SECURE') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
