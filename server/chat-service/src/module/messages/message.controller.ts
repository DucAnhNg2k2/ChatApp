import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { User } from 'src/decorators/user.decorator';
import { UserReq } from 'src/const/const';
import { query } from 'express';
import { MessageGetDto } from './dto/message-get.dto';
import { MessageCreateDto } from './dto/message-create.dto';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('page')
  getMessages(
    @User() user: UserReq,
    @Query() query: MessageGetDto,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.messageService.getListMessage(user, query, page, limit);
  }
}
