import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'AUTH_SERVICE',
          imports: [ConfigModule],
          useFactory: (ConfigService: ConfigService) => {
            return {
              transport: Transport.TCP,
              options: {
                host: ConfigService.get('AUTH_SERVICE_HOST'),
                port: ConfigService.get('AUTH_SERVICE_TRANSPORT_PORT'),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
