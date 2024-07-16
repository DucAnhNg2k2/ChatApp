import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { typeMessage } from 'src/schema/message.schema';

export class MessageCreateDto {
  @Type(() => String)
  @IsEnum(typeMessage)
  typeMessage: typeMessage;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
