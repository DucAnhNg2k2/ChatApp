import { MessageDTO } from "./MessageDTO";

export interface ConversationGetAllDTO {
  id: number;
  name?: string;
  messageDTO: MessageDTO;
}
