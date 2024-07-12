import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Members } from 'src/schema/member.schema';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Members.name, 'chat-service')
    private memberModel: Model<Members>,
  ) {}

  async mapToMemberChat(data: any) {
    // const { id, members } = data;
    // const member = await this.memberModel.findById(id);
    // if (!member) {
    //   return null;
    // }
    // member.members = members;
    // return member.save();
  }
}
