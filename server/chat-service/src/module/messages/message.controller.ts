import { Controller, Get, Post, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { User } from 'src/decorators/user.decorator';
import { UserReq } from 'src/const/const';
import { query } from 'express';
import { MessageGetDto } from './dto/message-get.dto';
import { MessageCreateDto } from './dto/message-create.dto';

@Controller('messages')
export class MessageController {
  // Không có method POST(createMessage). createMessage sẽ được xử lý bởi WebsocketService
  constructor(private messageService: MessageService) {}

  @Get('page')
  getMessages(@User() user: UserReq, @Query() query: MessageGetDto) {
    return this.messageService.getListMessage(user, query);
  }
}
