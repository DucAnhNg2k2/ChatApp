import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { MessageChat } from "../../type/message-type";
import "./style.scss";
import { HOST_SERVER, PORT_SERVER } from "../../config/config";
import { typeMessage } from "../../enum/message-type.enum";
import { getAvatar } from "../../utils/avatar.utils";
import { ConversationType } from "../../type/conversation-type";
import { getMemberCreateMessage, getMemberMeInConversation, isCreatedMessage } from "../../utils/conversation.utils";

interface MessageProps {
  message: MessageChat;
  conversation: ConversationType;
}
const Message = (props: MessageProps) => {
  const { message, conversation } = props;

  const profile = useSelector((state: RootState) => state.profile).data;
  const memberCreateMessage = getMemberCreateMessage(message, conversation.members);
  const isCreateMessage = memberCreateMessage?.userId === profile.userId;

  return (
    <div className="chat-message" style={{ flexDirection: isCreateMessage ? "row-reverse" : "row" }}>
      <img src={getAvatar(memberCreateMessage?.avatar)} className="chat-message-img" title={memberCreateMessage?.name} />
      {message.type == typeMessage.TEXT ? (
        <p className="chat-message-text" title={`${message.createdAt}`}>
          {message.content}
        </p>
      ) : (
        <img src={`${message.content}`} className="chat-message-image" title={`${message.createdAt}`} />
      )}
    </div>
  );
};
//

export default Message;
