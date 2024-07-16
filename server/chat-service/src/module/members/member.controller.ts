import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { MessagePattern } from '@nestjs/microservices';
import { MESSAGE_PATTERN } from 'src/const/pattern';
import { MapToMemberChat } from './dto/member-map.dto';
import { MemberGetDto } from './dto/member-get.dto';
import { User } from 'src/decorators/user.decorator';
import { UserReq } from 'src/const/const';

@Controller('members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @MessagePattern({ cmd: MESSAGE_PATTERN.MAP_TO_MEMBER_CHAT })
  async createMember(data: MapToMemberChat) {
    await this.memberService.mapToMemberChat(data);
    return true;
  }

  @Get('get')
  async getMembers(@Query() query: MemberGetDto, @User() user: UserReq) {
    return await this.memberService.getMembers(query, user);
  }
}
