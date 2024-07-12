import { User } from "./UserDTO";

export interface ConversationDetailDTO {
  id: number;
  name?: string;
  users: User[];
}
