import { typeMessage } from "../../../enum/message-type.enum";

export interface MessageCreateDto {
  content: string;
  typeMessage: typeMessage;
  conversationId: string;
}
