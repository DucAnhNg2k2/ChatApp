import { Socket } from "socket.io-client";
import instanceAxios, { endPointConversation } from ".";
import { MembersChat } from "../type/member-type";
import { ResponseType } from "../type/response.type";
import { MessageCreateDto } from "../Pages/Chat/dto/message-create.dto";
import { SUBSCRIBE_MESSAGE } from "../config/config";
import { MessageChat } from "../type/message-type";

const endPoint = {
  // Conversation
  getByMember: "conversations/get-by-member",
  getById: "conversations/get-by-id",
  page: "conversations/page",
  // Message
  messagePage: "messages/page",
};

// Conversation
interface ResponseConversationGet {
  _id: string;
  members: MembersChat[];
  name: string;
  messages: any[];
}
const requestConversationPage = (token: string): Promise<ResponseType<ResponseConversationGet[]>> => {
  return instanceAxios
    .get(endPoint.page, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data);
};
const requestConversationGetByMember = (token: string, member: MembersChat): Promise<ResponseType<ResponseConversationGet>> => {
  return instanceAxios
    .get(endPoint.getByMember + `?memberId=${member._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data);
};
const requestConversationGetById = (token: string, id: string): Promise<ResponseType<ResponseConversationGet>> => {
  return instanceAxios
    .get(endPoint.getById + `?_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data);
};

const requestConversationCreate = (token: string, uid: number) => {
  return instanceAxios.post(
    endPointConversation + `/create`,
    {
      useridTo: uid,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Message
const requestMessageCreate = (socket: Socket | null, messageCreateDto: MessageCreateDto) => {
  if (!socket) {
    return false;
  }
  socket.emit(SUBSCRIBE_MESSAGE.CREATE_MESSAGE, messageCreateDto);
  return true;
};
const requestMessageGet = (token: string, conversationId: string): Promise<ResponseType<MessageChat[]>> => {
  return instanceAxios
    .get(endPoint.messagePage + `?conversationId=${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data);
};

export { requestConversationCreate, requestConversationGetById, requestConversationGetByMember, requestConversationPage };
export { requestMessageCreate, requestMessageGet };
