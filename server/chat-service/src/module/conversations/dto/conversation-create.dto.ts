import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class ConversationCreateByMemberDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;
}
