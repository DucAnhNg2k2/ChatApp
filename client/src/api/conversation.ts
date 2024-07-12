import instanceAxios, { endPointConversation } from ".";

const requestConversationGetByUid = (token: string, uid: number) => {
  return instanceAxios.get(endPointConversation + `/get-by-uid/${uid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
export { requestConversationGetByUid, requestConversationCreate };
