import { ConversationListType } from "../type/conversation-list-type";
import { MembersChat } from "../type/member-type";
import { MessageChat } from "../type/message-type";

const conversationFindIndexById = (_id: string, a: ConversationListType[]) => {
  const index = a.findIndex(item => item._id === _id);
  return index;
};

const getMemberOtherInConversation = (members: MembersChat[], userId: number) => {
  const member = members.find(member => member.userId !== userId);
  return member;
};

const getMemberMeInConversation = (members: MembersChat[], userId: number) => {
  const member = members.find(member => member.userId === userId);
  return member;
};

const isCreatedMessage = (message: MessageChat, member: MembersChat | undefined) => {
  if (!member) return false;
  switch (typeof message.createdBy) {
    case "string":
      return message.createdBy === member._id;
    case "object":
      return (message.createdBy as MembersChat)._id === member._id;
    default:
      return false;
  }
};

const getMemberCreateMessage = (message: MessageChat, members: MembersChat[]) => {
  return members.find(member => {
    switch (typeof message.createdBy) {
      case "string":
        return message.createdBy === member._id;
      case "object":
        return (message.createdBy as MembersChat)._id === member._id;
      default:
        return false;
    }
  });
};

export { conversationFindIndexById, isCreatedMessage };
export { getMemberCreateMessage, getMemberMeInConversation, getMemberOtherInConversation };
