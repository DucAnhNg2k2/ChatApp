import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationGetDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
