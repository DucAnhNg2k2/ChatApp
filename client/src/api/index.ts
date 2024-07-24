import axios from "axios";
import { HOST_SERVER, PORT_SERVER } from "../config/config";

const instanceAxios = axios.create({
  baseURL: `http://${HOST_SERVER}:${PORT_SERVER}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const endPointConversation = "/conversation";
export const endPointMessage = "/message";
export const endPointAuth = "/auth";
export const endPointUpload = "/uploads";

const verifyToken = (accessToken: string) => {
  return instanceAxios.post("/verify-token", {
    accessToken,
  });
};

const requestConversationDetail = (id: number, token: string) => {
  return instanceAxios.get(endPointConversation + `/get/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const requestConversationGetAll = (token: string) => {
  return instanceAxios.get(endPointConversation + "/get-all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// const requestGetMessage = (cid: number, token: string, page: number, size: number) => {
//   return instanceAxios.get(endPointMessage + `/get/${cid}?page=${page}&size=${size}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export default instanceAxios;
export { requestConversationDetail, requestConversationGetAll, verifyToken };
