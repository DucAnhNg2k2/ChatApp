import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/const/const';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageModule } from '../messages/message.module';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: AuthService.AUTH_SERVICE,
          imports: [ConfigModule],
          useFactory: (ConfigService: ConfigService) => {
            return {
              transport: Transport.TCP,
              options: {
                host: ConfigService.get(AuthService.AUTH_SERVICE_HOST),
                port: ConfigService.get(
                  AuthService.AUTH_SERVICE_TRANSPORT_PORT,
                ),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
    MessageModule,
  ],
  controllers: [],
  providers: [WebsocketService],
  exports: [],
})
export class WebsocketModule {}
