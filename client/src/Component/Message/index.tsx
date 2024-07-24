import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { MessageChat } from "../../type/message-type";
import "./style.scss";
import { HOST_SERVER, PORT_SERVER } from "../../config/config";
import { typeMessage } from "../../enum/message-type.enum";

interface MessageProps {
  message: MessageChat;
}
const Message = (props: MessageProps) => {
  const { message } = props;
  const profile = useSelector((state: RootState) => state.profile).data;
  const isFromMe = (message.createdBy.userId = profile.userId);

  return (
    <div className="chat-message" style={{ flexDirection: isFromMe ? "row-reverse" : "row" }}>
      {/* <img src={AvatarDefault(user?.avatar)} className="chat-message-img" title={user?.displayName} /> */}
      {message.type == typeMessage.TEXT ? (
        <p className="chat-message-text" title={`${message.createdAt}`}>
          {message.content}
        </p>
      ) : (
        <div></div>
      )}
    </div>
  );
};
// <img src={`http://${HOST_SERVER}:${PORT_SERVER}/api/uploads/get/${item.text}`} className="chat-message-image" title={`${item.createTime}`} />)

export default Message;
