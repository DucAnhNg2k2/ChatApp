import instanceAxios, { endPointConversation } from ".";
import { MembersChat } from "../type/member-type";
import { ResponseType } from "../type/response.type";

const endPoint = {
  get: "conversations/get",
};

interface ResponseConversationGet {
  _id: string;
  members: MembersChat[];
  name: string;
}
const requestConversationGet = (token: string, member: MembersChat): Promise<ResponseType<ResponseConversationGet>> => {
  return instanceAxios
    .get(endPoint.get + `?memberId=${member._id}`, {
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
export { requestConversationGet, requestConversationCreate };
