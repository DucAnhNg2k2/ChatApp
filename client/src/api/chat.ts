import { Socket } from "socket.io-client";
import instanceAxios, { endPointConversation } from ".";
import { MembersChat } from "../type/member-type";
import { ResponseType } from "../type/response.type";
import { MessageCreateDto } from "../Pages/Chat/dto/message-create.dto";
import { SUBSCRIBE_MESSAGE } from "../config/config";
import { MessageChat } from "../type/message-type";

const endPoint = {
  // Conversation
  conversation: "conversations",
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
  avatar: string;
  messages: any[];
  lastMessage: MessageChat;
  isMock?: boolean;
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

const requestConversationCreate = (token: string, memberId: string): Promise<ResponseType<ResponseConversationGet>> => {
  return instanceAxios
    .post(
      endPoint.conversation,
      {
        memberId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(res => res.data);
};

// Message
const requestMessageCreate = (socket: Socket | null, messageCreateDto: MessageCreateDto) => {
  if (!socket) {
    return false;
  }
  socket.emit(SUBSCRIBE_MESSAGE.CREATE_MESSAGE, messageCreateDto);
  return true;
};
const requestMessageGet = (token: string, conversationId: string, limit: number, page: number): Promise<ResponseType<MessageChat[]>> => {
  return instanceAxios
    .get(endPoint.messagePage + `?conversationId=${conversationId}&limit=${limit}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => res.data);
};

export { requestConversationCreate, requestConversationGetById, requestConversationGetByMember, requestConversationPage };
export { requestMessageCreate, requestMessageGet };
