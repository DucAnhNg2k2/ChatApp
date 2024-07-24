import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserReq } from 'src/const/const';
import { Conversations } from 'src/schema/conversation.schema';
import { Members } from 'src/schema/member.schema';
import { MemberService } from '../members/member.service';
import { ConversationCreateByMemberDto } from './dto/conversation-create.dto';
import { ConversationGetByMemberDto } from './dto/conversation-get-by-member.dto';
import { ConversationGetByIdDto } from './dto/conversation-get-by-id.dto';
import * as mongoose from 'mongoose';
@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversations.name, 'chat-service')
    private conversationModel: Model<Conversations>,
    private memberService: MemberService,
  ) {}

  async getListConversation(user: UserReq) {
    const conversations = await this.conversationModel
      .aggregate([
        {
          $lookup: {
            from: 'members',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'lastMessage',
            foreignField: '_id',
            as: 'messages',
          },
        },
      ])
      .exec();

    // Map conversation to get name
    return conversations.map((conversation) => {
      const member = (conversation.members as Members[]).find(
        (member: Members) => member.userId !== user.id,
      );
      return {
        ...conversation,
        name: member.name,
      };
    });
  }

  async getConversationByMember(
    user: UserReq,
    query: ConversationGetByMemberDto,
  ) {
    const conversation = await this.conversationModel
      .aggregate([
        {
          $lookup: {
            from: 'members',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'lastMessage',
            foreignField: '_id',
            as: 'messages',
          },
        },
      ])
      .exec();

    // Not exist -> Create mock conversation
    if (!conversation.length) {
      const member: Members = await this.memberService.findByIdOrFail(
        query.memberId,
      );
      const mock = {
        name: member.name,
      };
      return mock;
    }

    const member = (conversation[0].members as Members[]).find(
      (member: Members) => member.userId !== user.id,
    );
    return {
      ...conversation[0],
      name: member.name,
    };
  }

  async getConversationById(user: UserReq, query: ConversationGetByIdDto) {
    const conversation = await this.conversationModel
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(query._id),
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'lastMessage',
            foreignField: '_id',
            as: 'messages',
          },
        },
      ])
      .exec();

    if (!conversation.length) {
      throw new Error('Conversation not found');
    }

    const member = (conversation[0].members as Members[]).find(
      (member: Members) => member.userId !== user.id,
    );
    return {
      ...conversation[0],
      name: member.name,
    };
  }

  async createConversation(
    user: UserReq,
    conversationCreateDto: ConversationCreateByMemberDto,
  ) {
    const getConversation = await this.getConversationByMember(
      user,
      conversationCreateDto,
    );
    if (getConversation) {
      throw new Error('Conversation already exist');
    }

    const { memberId } = conversationCreateDto;
    const [member, curMember] = await Promise.all([
      this.memberService.findByIdOrFail(memberId),
      this.memberService.findByUserIdOrFail(user.id),
    ]);
    const conversation = new this.conversationModel({
      members: [curMember, member],
    });
    await conversation.save();
    return { conversation, name: member.name };
  }

  async checkUserInConversation(user: UserReq, conversationId: string) {
    const member = await this.memberService.findByUserIdOrFail(user.id);
    const conversation = await this.conversationModel
      .findOne({
        _id: conversationId,
        members: member._id,
      })
      .exec();
    if (!conversation) {
      throw new Error('User not in conversation');
    }
    return conversation;
  }
}
