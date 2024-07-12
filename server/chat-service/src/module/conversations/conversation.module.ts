import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversations,
  ConversationsSchema,
} from 'src/schema/conversation.schema';
import { MemberModule } from '../members/member.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Conversations.name, schema: ConversationsSchema }],
      'chat-service',
    ),
    MemberModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
