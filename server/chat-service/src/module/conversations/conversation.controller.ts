import { UserReq } from 'src/const/const';
import { ConversationService } from './conversation.service';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { ConversationCreateDto } from './dto/conversation-create.dto';
import { ConversationGetDto } from './dto/conversation-get.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private ConversationService: ConversationService) {}

  @Get('page')
  getConversations(@User() user: UserReq) {
    return this.ConversationService.getListConversation(user);
  }

  @Get('get')
  getConversation(@User() user: UserReq, @Query() query: ConversationGetDto) {
    return this.ConversationService.getConversation(user, query);
  }

  @Post('')
  createConversation(
    @User() user: UserReq,
    @Body() conversationCreateDto: ConversationCreateDto,
  ) {
    return this.ConversationService.createConversation(
      user,
      conversationCreateDto,
    );
  }
}
