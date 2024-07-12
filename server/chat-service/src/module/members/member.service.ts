import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Members } from 'src/schema/member.schema';
import { MapToMemberChat } from './dto/member-map.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Members.name, 'chat-service')
    private memberModel: Model<Members>,
  ) {}

  // Update Or Create Member
  async mapToMemberChat(data: MapToMemberChat) {
    const { userId, name, address } = data;
    const member = await this.findByUserId(userId);
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

  async findByUserId(userId: number) {
    return this.memberModel.findOne({
      userId,
    });
  }
}
