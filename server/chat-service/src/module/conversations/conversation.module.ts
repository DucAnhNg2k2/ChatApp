import { forwardRef, Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversations,
  ConversationsSchema,
} from 'src/schema/conversation.schema';
import { MemberModule } from '../members/member.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Conversations.name, schema: ConversationsSchema }],
      'chat-service',
    ),
    MemberModule,
    // forwardRef(() => WebsocketModule),
    WebsocketModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
