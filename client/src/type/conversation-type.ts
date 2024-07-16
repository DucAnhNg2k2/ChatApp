import { MembersChat } from "./member-type";

export interface ConversationType {
  _id: string;
  name: string;
  members: MembersChat[];
}
