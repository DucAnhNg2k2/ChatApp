import { ConversationGetAllDTO } from "../type/ConversationGetAllDTO";
const ConversationFindIndexById = (cid: number | undefined, a: ConversationGetAllDTO[]) => {
  const index = a.findIndex(item => item.id === cid);
  return index;
};

export { ConversationFindIndexById };
