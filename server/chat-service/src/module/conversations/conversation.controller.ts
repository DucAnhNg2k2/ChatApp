import { ConversationService } from './conversation.service';
import { Controller } from '@nestjs/common';

@Controller('conversations')
export class ConversationController {
  constructor(private ConversationService: ConversationService) {}
}
