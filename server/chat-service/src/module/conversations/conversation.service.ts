import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversations } from 'src/schema/conversation.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversations.name, 'chat-service')
    private conversationModel: Model<Conversations>,
  ) {}
}
