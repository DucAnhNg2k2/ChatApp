import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('queue')
export class QueueController {
  constructor() {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return 'Hello World!';
  }
}
