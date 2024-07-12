import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Messages } from 'src/schema/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Messages.name, 'chat-service')
    private messageModel: Model<Messages>,
  ) {}
}
