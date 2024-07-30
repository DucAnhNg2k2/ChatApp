import { AVATAR_ERROR, HOST_SERVER, PORT_SERVER } from "../config/config";

const getAvatar = (avatar: string | undefined): string => {
  if (!avatar) {
    return `http://${HOST_SERVER}:${PORT_SERVER}/files/download/${AVATAR_ERROR}`;
  }
  return avatar?.includes("https") ? avatar : `http://${HOST_SERVER}:${PORT_SERVER}/files/download/${avatar}`;
};

export { getAvatar };
