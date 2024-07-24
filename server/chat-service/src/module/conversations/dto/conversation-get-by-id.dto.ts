import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationGetByIdDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
