import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Members } from 'src/schema/member.schema';
import { MapToMemberChat } from './dto/member-map.dto';
import { MemberGetDto } from './dto/member-get.dto';
import { UserReq } from 'src/const/const';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Members.name, 'chat-service')
    private memberModel: Model<Members>,
  ) {}

  // Update Or Create Member
  async mapToMemberChat(data: MapToMemberChat) {
    const { userId, name, address } = data;
    const member = await this.findByUserIdOrFail(userId);
    if (!member) {
      return this.memberModel.create({
        userId,
        name,
        address,
      });
    } else {
      member.name = name;
      return member.save();
    }
  }

  async findByUserIdOrFail(userId: number) {
    const member = await this.memberModel.findOne({
      userId,
    });
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }

  async getMembers(query: MemberGetDto, user: UserReq) {
    const { name } = query;
    return this.memberModel.find({
      name: {
        $regex: new RegExp(name, 'i'),
      },
      userId: { $ne: user.id },
    });
  }

  async findByIdOrFail(id: string) {
    const member = this.memberModel.findById(id);
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }
}
