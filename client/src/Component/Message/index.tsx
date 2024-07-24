import { MembersChat } from "../../type/member-type";
import { MessageDTO } from "../../type/MessageDTO";
import "./style.scss";

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
