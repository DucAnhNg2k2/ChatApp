import { ConversationListType } from "../type/conversation-list-type";

const ConversationFindIndexById = (_id: string, a: ConversationListType[]) => {
  const index = a.findIndex(item => item._id === _id);
  return index;
};

export { ConversationFindIndexById };
