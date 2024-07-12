import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from 'src/const/const';
import { UserProfile } from 'src/database/entity/user-profile.entity';
import { UserProfileController } from './user-profile.controller';
import { UserProfileRepository } from './user-profile.repository';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfile]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: ChatService.CHAT_SERVICE,
          imports: [ConfigModule],
          useFactory: (ConfigService: ConfigService) => {
            return {
              transport: Transport.TCP,
              options: {
                host: ConfigService.get(ChatService.CHAT_SERVICE_HOST),
                port: ConfigService.get(
                  ChatService.CHAT_SERVICE_TRANSPORT_PORT,
                ),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [UserProfileController],
  providers: [UserProfileService, UserProfileRepository],
})
export class UserProfileModule {}
