import { MembersChat } from "./member-type";

export interface ConversationType {
  _id: string;
  name: string;
  avatar: string;
  members: MembersChat[];
  isMock?: boolean;
}
