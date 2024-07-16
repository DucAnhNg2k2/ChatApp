import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class ConversationCreateDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
