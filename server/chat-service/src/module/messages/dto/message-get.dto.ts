import { IsNotEmpty, IsString } from 'class-validator';

export class MessageGetDto {
  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
