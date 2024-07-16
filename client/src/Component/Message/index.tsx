import { useSelector } from "react-redux";
import { HOST_SERVER, PORT_SERVER } from "../../config/config";
import { RootState } from "../../Store";
import { MessageDTO } from "../../type/MessageDTO";
import { AvatarDefault } from "../../utils/AvatarUtil";
import "./style.scss";
import { MembersChat } from "../../type/member-type";

const Message = ({ item, members }: { item: MessageDTO; members: MembersChat[] | undefined }) => {
  // const profile = useSelector((state: RootState) => state.profile);
  // const user = users?.find(user => user._id === item.userId);
  // const isFromMe = profile.data.id === user?.id;

  return (
    <div></div>
    // <div className="chat-message" style={{ flexDirection: isFromMe ? "row-reverse" : "row" }}>
    /* <img src={AvatarDefault(user?.avatar)} className="chat-message-img" title={user?.displayName} />
      {item.type === "text" ? (
        <p className="chat-message-text" title={`${item.createTime}`}>
          {item.text}
        </p>
      ) : (
        <img src={`http://${HOST_SERVER}:${PORT_SERVER}/api/uploads/get/${item.text}`} className="chat-message-image" title={`${item.createTime}`} />
      )} */
    // </div>
  );
};

export default Message;
