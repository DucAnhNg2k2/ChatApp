import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberModule } from './module/members/member.module';
import { ConversationModule } from './module/conversations/conversation.module';
import { MessageModule } from './module/messages/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      connectionName: 'chat-service',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('MONGO_URI'));

        return {
          uri: configService.get('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    MemberModule,
    ConversationModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
