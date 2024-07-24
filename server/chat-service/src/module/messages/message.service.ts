import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Messages } from 'src/schema/message.schema';
import { MessageCreateDto } from './dto/message-create.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Messages.name, 'chat-service')
    private messageModel: Model<Messages>,
  ) {}

  async createMessage(data: MessageCreateDto, userId: number) {
    // const message = new this.messageModel(data);
    // return message.save();
  }
}
