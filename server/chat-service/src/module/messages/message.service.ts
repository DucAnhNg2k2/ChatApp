import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
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
    // Check the current user in the conversation
    const { memberMe, conversation } =
      await this.conversationService.checkUserInConversation(
        { id: userId },
        data.conversationId,
      );
    if (!conversation) {
      throw new Error('User is not in conversation');
    }

    // Create message
    const message = new this.messageModel({
      content: data.content,
      createdBy: memberMe,
      conversationId: data.conversationId,
      type: data.typeMessage,
      senders: [],
    });
    // Update Last message in conversation
    conversation.lastMessage = message;
    const [messageData] = await Promise.all([
      message.save(),
      this.conversationService.updateConversation(conversation),
    ]);
    return {
      message: messageData,
      conversation,
    };
  }

  async getListMessage(user: UserReq, query: MessageGetDto) {
    // Check the current user in the conversation
    const { conversation } =
      await this.conversationService.checkUserInConversation(
        user,
        query.conversationId,
      );
    if (!conversation) {
      throw new Error('User is not in conversation');
    }
    const data = await this.messageModel.aggregate([
      {
        $match: {
          conversationId: new mongoose.Types.ObjectId(query.conversationId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
    ]);
    return data.map((message) => {
      return {
        ...message,
        createdBy: message.createdBy[0],
      };
    });
  }
}
