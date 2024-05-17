import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueModule } from './module/queue/queue.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
