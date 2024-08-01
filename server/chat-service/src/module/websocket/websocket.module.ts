import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from 'src/const/const';
import { MessageModule } from '../messages/message.module';
import { WebsocketService } from './websocket.service';

// WebSocketModule -> MessageModule -> ConversationModule -> WebsocketModule => Circular dependency
// ModuleRef:
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
    // forwardRef(() => MessageModule),
    MessageModule,
  ],
  controllers: [],
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
