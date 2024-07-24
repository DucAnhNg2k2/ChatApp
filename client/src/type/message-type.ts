import { typeMessage } from "../enum/message-type.enum";
import { MembersChat } from "./member-type";

export interface MessageChat {
  content: string;
  type: typeMessage;
  _id: string;
  conversationId: string;
  createdBy: MembersChat;
  createdAt: string;
}
