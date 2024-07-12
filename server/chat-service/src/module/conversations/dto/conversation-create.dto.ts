import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class ConversationCreateDto {
  @IsNumberString()
  @IsNotEmpty()
  userId: number;
}
