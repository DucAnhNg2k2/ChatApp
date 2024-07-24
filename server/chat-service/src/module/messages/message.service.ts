import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserReq } from 'src/const/const';
import { Messages } from 'src/schema/message.schema';
import { ConversationService } from '../conversations/conversation.service';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageGetDto } from './dto/message-get.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Messages.name, 'chat-service')
    private messageModel: Model<Messages>,
    private conversationService: ConversationService,
  ) {}

  async createMessage(userId: number, data: MessageCreateDto) {
    console.log(userId, data);

    // const message = new this.messageModel(data);
    // return message.save();
  }

  async getListMessage(user: UserReq, query: MessageGetDto) {
    // Check if user is in conversation
    const conversation = await this.conversationService.checkUserInConversation(
      user,
      query.conversationId,
    );
    if (!conversation) {
      throw new Error('User is not in conversation');
    }
    return this.messageModel.find({
      conversationId: query.conversationId,
    });
  }
}
