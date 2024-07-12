import { HOST_SERVER, PORT_SERVER } from "../config/config";
import { User } from "../type/UserDTO";

// Find User Other In Conversation
const ConversationFindUserOther = (users: User[], uid: number | undefined) => {
  return users.find(item => item.id !== uid);
};

const ConversationFindUserOtherImage = (users: User[], uid: number | undefined) => {
  const user = users.find(item => item.id !== uid);
  if (user) {
    const { avatar } = user;
    return avatar?.includes("https") ? avatar : `http://${HOST_SERVER}:${PORT_SERVER}/api/uploads/get/${avatar}`;
  }
};

export { ConversationFindUserOther, ConversationFindUserOtherImage };
