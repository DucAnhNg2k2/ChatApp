import { UserReq } from 'src/const/const';
import { ConversationService } from './conversation.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { ConversationCreateDto } from './dto/conversation-create.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private ConversationService: ConversationService) {}

  @Get('page')
  getConversations() {
    return this.ConversationService.getListConversation();
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
