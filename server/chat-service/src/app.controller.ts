import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Các API cần thiết cho chat-service
  /*
    - Lấy toàn bộ các cuộc trò chuyện(Phân trang)
    - Lấy thông tin chi tiết 1 cuộc trò chuyện
    - Lây tin nhắn trong 1 cuộc trò chuyện(Phân trang)
    - Gửi tin nhắn trong 1 cuộc trò chuyện
    - Tạo mới 1 cuộc trò chuyện
  */

  @Get('')
  getConversations() {
    // return this.appService.getAllConversation();
  }

  @Get(':id')
  getConversation() {
    // return this.appService.getConversationDetail();
  }

  @Get(':id/messages')
  getMessages() {
    // return this.appService.getMessages();
  }

  @Post('')
  createConversation() {
    // return this.appService.createConversation();
  }
}
