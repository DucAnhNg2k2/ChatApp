import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationGetByMemberDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
