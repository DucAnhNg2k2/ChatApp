import instanceAxios, { endPointConversation } from ".";
import { MembersChat } from "../type/member-type";
import { ResponseType } from "../type/response.type";

const endPoint = {
  getByMember: "conversations/get-by-member",
  getById: "conversations/get-by-id",
  page: "conversations/page",
};

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
export { requestConversationCreate, requestConversationGetById, requestConversationGetByMember, requestConversationPage };
