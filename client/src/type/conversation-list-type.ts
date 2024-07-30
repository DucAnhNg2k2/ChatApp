import { MembersChat } from "./member-type";
import { MessageChat } from "./message-type";

export interface ConversationListType {
  _id: string;
  name: string;
  avatar: string;
  members: MembersChat[];
  lastMessage: MessageChat;
}
