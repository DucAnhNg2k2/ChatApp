import { ConversationCreateDto } from './dto/conversation-create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserReq } from 'src/const/const';
import { User } from 'src/decorators/user.decorator';
import { Conversations } from 'src/schema/conversation.schema';
import { MemberService } from '../members/member.service';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversations.name, 'chat-service')
    private conversationModel: Model<Conversations>,
    private memberService: MemberService,
  ) {}

  async getListConversation() {
    const conversations = await this.conversationModel.find().exec();
    console.log(conversations);
    return conversations;
  }

  async createConversation(
    user: UserReq,
    conversationCreateDto: ConversationCreateDto,
  ) {
    const { userId } = conversationCreateDto;
    return this.memberService.findByUserId(userId);
    // const conversation = new this.conversationModel({
    //   name: 'New Conversation',
    //   members: ['1', '2'],
    // });
    // await conversation.save();
    // return conversation;
  }
}
