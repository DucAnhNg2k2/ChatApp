import { UserReq } from 'src/const/const';
import { ConversationService } from './conversation.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { ConversationCreateByMemberDto } from './dto/conversation-create.dto';
import { ConversationGetByMemberDto } from './dto/conversation-get-by-member.dto';
import { ConversationGetByIdDto } from './dto/conversation-get-by-id.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private ConversationService: ConversationService) {}

  @Get('page')
  getConversations(@User() user: UserReq) {
    return this.ConversationService.getListConversation(user);
  }

  @Get('get-by-member')
  getConversationByMemberId(
    @User() user: UserReq,
    @Query() query: ConversationGetByMemberDto,
  ) {
    return this.ConversationService.getConversationByMember(user, query);
  }

  @Get('get-by-id')
  getConversationById(
    @User() user: UserReq,
    @Query() query: ConversationGetByIdDto,
  ) {
    return this.ConversationService.getConversationById(user, query);
  }

  @Post('')
  createConversation(
    @User() user: UserReq,
    @Body() conversationCreateDto: ConversationCreateByMemberDto,
  ) {
    return this.ConversationService.createConversation(
      user,
      conversationCreateDto,
    );
  }
}
