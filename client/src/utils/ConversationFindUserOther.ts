import { HOST_SERVER, PORT_SERVER } from "../config/config";
import { MembersChat } from "../type/member-type";

// Find User Other In Conversation
const ConversationFindUserOther = (users: MembersChat[], uid: number | undefined) => {
  return users.find(item => item.userId !== uid);
};

const ConversationFindUserOtherImage = (users: MembersChat[], uid: number | undefined) => {
  const user = users.find(item => item.userId !== uid);
  if (user) {
    // const { avatar } = user;
    // return avatar?.includes("https") ? avatar : `http://${HOST_SERVER}:${PORT_SERVER}/api/uploads/get/${avatar}`;
  }
};

export { ConversationFindUserOther, ConversationFindUserOtherImage };
