import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Messages, MessagesSchema } from 'src/schema/message.schema';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Messages.name, schema: MessagesSchema }],
      'chat-service',
    ),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
