import { AVATAR_ERROR, HOST_SERVER, PORT_SERVER } from "../config/config";

const AvatarDefault = (avatar: string | undefined): string => {
  if (avatar === undefined) {
    return `http://${HOST_SERVER}:${PORT_SERVER}/api/uploads/get/${AVATAR_ERROR}`;
  }
  return avatar?.includes("https") ? avatar : `http://${HOST_SERVER}:${PORT_SERVER}/api/uploads/get/${avatar}`;
};

export { AvatarDefault };
