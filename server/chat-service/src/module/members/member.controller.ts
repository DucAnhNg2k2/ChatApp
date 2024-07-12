import { Controller, Injectable } from '@nestjs/common';
import { MemberService } from './member.service';
import { MessagePattern } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from 'src/const/pattern';
import { MapToMemberChat } from './dto/member-map.dto';

@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN.MAP_TO_MEMBER_CHAT })
  async createMember(data: MapToMemberChat) {
    await this.memberService.mapToMemberChat(data);
    return true;
  }
}
