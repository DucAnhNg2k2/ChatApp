const HOST_SERVER = process.env.REACT_APP_HOST_BACKEND;
const PORT_SERVER = process.env.REACT_APP_PORT_BACKEND;
const PORT_SERVER_SOCKET = process.env.REACT_APP_PORT_BACKEND_SOCKET;

const AVATAR_ERROR: string = "avatar_null.jpg";
export { HOST_SERVER, PORT_SERVER, PORT_SERVER_SOCKET, AVATAR_ERROR };

export const SUBSCRIBE_MESSAGE = {
  CREATE_MESSAGE: "create-message",
  RECEIVE_MESSAGE: "receive-message",
  RECEIVE_NEW_CONVERSATION: "receive-new-conversation",
  CREATE_NEW_CONVERSATION: "create-new-conversation",
};
