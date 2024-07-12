import { HttpStatusCode } from "axios";
import lodash from "lodash";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactLoading from "react-loading";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { requestConversationDetail, requestConversationGetAll, requestGetMessage } from "../../api";
import { requestGetUser } from "../../api/auth";
import { requestConversationCreate, requestConversationGetByUid } from "../../api/conversation";
import { requestUploadBase64 } from "../../api/upload";
import Input from "../../Component/Input";
import Loading from "../../Component/Loading";
import Message from "../../Component/Message";
import Modal from "../../Component/Modal";
import UpdateProfile from "../../Component/UpdateProfile";
import { HOST_SERVER, PORT_SERVER } from "../../config/config";
import { toastObject } from "../../config/toast";
import { RootState } from "../../Store";
import { ConversationDetailDTO } from "../../type/ConversationDetailDTO";
import { ConversationGetAllDTO } from "../../type/ConversationGetAllDTO";
import { MessageDTO } from "../../type/MessageDTO";
import { ResponseType } from "../../type/response.type";
import { User } from "../../type/UserDTO";
import { AvatarDefault } from "../../utils/AvatarUtil";
import { CheckProfile } from "../../utils/CheckProfile";
import { ConversationFindIndexById } from "../../utils/ConversationFindIndexById";
import { ConversationFindUserOther, ConversationFindUserOtherImage } from "../../utils/ConversationFindUserOther";
import "./chat.scss";

const SIZE = 15;
const Conversation = () => {
  const token = useSelector((state: RootState) => state.token).value;
  const profile = useSelector((state: RootState) => state.profile).data;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // Detail-Conversation List-members[]
  const [conversationDetailDTO, setConversationDetailDTO] = React.useState<ConversationDetailDTO>();
  // GetAll-Conversations
  const [conversationGetAllDTO, setConversationGetAllDTO] = React.useState<ConversationGetAllDTO[]>([]);
  // Message[] of Detail-Conversation
  const [messageDTO, setMessageDTO] = React.useState<MessageDTO[]>([]);
  // Input Text
  const [text, setText] = React.useState<string>("");
  const [isLoadingSearch, setIsLoadingSearch] = React.useState<boolean>(true);
  // Name of Profile-User
  const [nameSearch, setNameSearch] = React.useState<string>("");
  // Search Profile-User
  const [resultSearch, setResultSearchDTO] = React.useState<User[]>([]);
  // Socket - Page - HasMore
  const [socket, setSocket] = React.useState<WebSocket>();
  const [page, setPage] = React.useState<number>(0);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [isVisible, setIsVisible] = React.useState<boolean>(CheckProfile(profile?.avatar, profile?.displayName));

  const refFile = React.useRef<HTMLInputElement>(null);
  const refConversation = React.useRef<HTMLDivElement>(null);

  // Get Conversation-All[]
  React.useEffect(() => {
    try {
      requestConversationGetAll(token).then(response => {
        const res: ResponseType = response.data;
        if (res.statusCode === HttpStatusCode.Ok) {
          setConversationGetAllDTO(res.data);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  // Connect socket
  React.useEffect(() => {
    try {
      const socket = new WebSocket(`ws://${HOST_SERVER}:${PORT_SERVER}/socket?token=${token}`);
      socket.onopen = () => {
        toast.success("Connect to socket success !", toastObject);
      };
      socket.onmessage = handleOnMessage;
      socket.onclose = () => {
        toast.error("Close socket !!", toastObject);
      };
      setSocket(socket);
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    if (isVisible) {
      toast.error("Cập nhật avatar và tên");
    }
  }, []);

  // Logic
  // Receive Text on socket
  const handleOnMessage = React.useCallback(
    async (event: MessageEvent<any>) => {
      const mess: MessageDTO = JSON.parse(event.data);
      const { id, conversationId, text, type, createTime, userId } = mess;
      if (!conversationId || !userId) {
        return;
      }
      const index = ConversationFindIndexById(conversationId, conversationGetAllDTO);
      if (index == -1) {
        // Insert to 0
        const stateMess = { ...mess };
        const resC: ResponseType = (await requestConversationDetail(conversationId, token)).data;
        if (resC.statusCode === HttpStatusCode.Ok) {
          const resCData: ConversationDetailDTO = resC.data;
          const user = resCData.users.find(item => item.id !== profile.id);
          if (user) {
            const { avatar, displayName } = user;
            stateMess.avatar = avatar;
            stateMess.displayName = displayName;
          }
        }
        const stateConversation: ConversationGetAllDTO = {
          id: conversationId,
          messageDTO: stateMess,
        };
        setConversationGetAllDTO(pre => [stateConversation, ...pre]);
      } else {
        // Swap ( 0 - index )
        const newState = [...conversationGetAllDTO];
        const tmpState = conversationGetAllDTO[index];
        newState[index] = newState[0];
        newState[0] = tmpState;
        // Update new Message
        newState[0].messageDTO.type = type;
        newState[0].messageDTO.text = text;
        newState[0].messageDTO.createTime = createTime;
        newState[0].messageDTO.id = id;
        newState[0].messageDTO.userId = userId;
        setConversationGetAllDTO(newState);
      }
      if (conversationDetailDTO && conversationDetailDTO.id == conversationId) {
        const newMess = [{ ...mess }, ...messageDTO];
        setMessageDTO(newMess);
      }
    },
    [conversationDetailDTO, messageDTO, conversationGetAllDTO]
  );

  // Send Text on socket
  const handleSendMessage = async (type: "text" | "image", message: string) => {
    try {
      if ((type === "image" || (type === "text" && text.length > 0)) && conversationDetailDTO?.id) {
        const mess: object = {
          type,
          message,
          to: conversationDetailDTO.id,
        };
        if (socket) {
          socket.send(JSON.stringify(mess));
          setText("");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Update socket on socket
  React.useEffect(() => {
    if (socket) {
      socket.onmessage = handleOnMessage;
    }
  }, [socket, handleOnMessage]);

  React.useEffect(() => {
    // Responsive mobile set style.left = 0
    if (refConversation && refConversation.current) {
      refConversation.current.style.left = "0%";
    }
  }, [conversationDetailDTO]);

  // Handle Search-Profile
  const handleChangeSearchLodash = React.useMemo(() => {
    return lodash.debounce((name: string) => {
      handleSearchUser(name);
    }, 300);
  }, []);
  const handleSearchUser = async (name: string) => {
    try {
      setIsLoadingSearch(true);
      const res: ResponseType = (await requestGetUser(token, name)).data;
      if (res.statusCode === HttpStatusCode.Ok) {
        setResultSearchDTO(res.data);
      }
      setIsLoadingSearch(false);
    } catch (err) {
      setIsLoadingSearch(false);
      console.log(err);
    }
  };
  const handleChangeSearch = (e: any) => {
    const name: string = e.target.value;
    setNameSearch(name);
    name.length === 0 ? setResultSearchDTO([]) : handleChangeSearchLodash(name);
  };
  const handleClickProfile = async ({ id }: User) => {
    try {
      const res: ResponseType = (await requestConversationGetByUid(token, id)).data;
      setResultSearchDTO([]);
      setNameSearch("");
      // Not found -> Create New
      if (res.statusCode === HttpStatusCode.BadRequest) {
        console.log("ConversationNotFound");
        console.log(res.message);
        const resCreate: ResponseType = (await requestConversationCreate(token, id)).data;
        if (resCreate.statusCode === HttpStatusCode.Ok) {
          const data: ConversationDetailDTO = resCreate.data;
          setConversationDetailDTO(data);
          setHasMore(false);
          setMessageDTO([]);
        } else {
          // Error ...
        }
      } else if (res.statusCode === HttpStatusCode.Ok) {
        const data: ConversationDetailDTO = res.data;
        setConversationDetailDTO(data);
        const resMessage: ResponseType = (await requestGetMessage(data.id, token, 0, SIZE)).data;
        if (resMessage.statusCode === HttpStatusCode.Ok) {
          setMessageDTO(resMessage.data);
        }
      }
    } catch (err) {}
  };

  // Click Conversation-Detail in Conversation-GetAll
  const handleClickConversation = async (item: ConversationGetAllDTO) => {
    try {
      if (conversationDetailDTO != null && conversationDetailDTO.id == item.id) {
        return;
      }
      if (isLoading) {
        return;
      }
      // Click Conversation-Detail
      const cid = item.id;
      setIsLoading(true);
      const resChat: ResponseType = (await requestConversationDetail(cid, token)).data;
      const resMessage: ResponseType = (await requestGetMessage(cid, token, 0, SIZE)).data;
      if (resChat.statusCode === HttpStatusCode.Ok) {
        setConversationDetailDTO(resChat.data);
      }
      if (resMessage.statusCode === HttpStatusCode.Ok) {
        setMessageDTO(resMessage.data);
      }
      setIsLoading(false);
      setHasMore(true);
      setPage(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNextDataMessage = async () => {
    try {
      console.log("Fetch More Message !!");
      const cid = conversationDetailDTO?.id;
      if (cid) {
        const newPage = page + 1;
        const resMessage: ResponseType = (await requestGetMessage(cid, token, newPage, SIZE)).data;
        if (resMessage.statusCode === 200) {
          const data: MessageDTO[] = resMessage.data;
          if (data.length === 0) {
            setHasMore(false);
          } else {
            setMessageDTO([...messageDTO, ...data]);
            setPage(newPage);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickButtonFile = () => {
    if (refFile.current) {
      refFile.current.click();
    }
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // 2 API
      // Upload File
      // Send File
      if (event.target.files) {
        const file = event.target.files[0];
        // Hash with base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const resultBase64String = reader.result as string;
          const res: ResponseType = (await requestUploadBase64(token, resultBase64String)).data;
          if (res.statusCode === HttpStatusCode.Ok) {
            const url = res.data;
            handleSendMessage("image", url);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickArrowLeft = () => {
    if (refConversation && refConversation.current) {
      refConversation.current.style.left = "100%";
    }
  };

  return (
    <Modal>
      <div className="chat-container">
        <div className="chat-list">
          <div className="chat-profile">
            <img src={AvatarDefault(profile.avatar)} className="chat-profile-img" alt="" />
            <div>
              <p className="chat-profile-name"> {profile.displayName} </p>
              <button className="chat-profile-edit" onClick={() => setIsVisible(true)}>
                <i className="fa-solid fa-user-pen"></i>
              </button>
            </div>
          </div>
          <div className="chat-search">
            <button className="chat-search-button" onClick={() => handleSearchUser(nameSearch)}>
              <i className="fa-solid fa-user-plus"></i>
            </button>
            <input placeholder="Search" className="chat-search-input" value={nameSearch} onChange={handleChangeSearch} />
          </div>
          {/* Find User */}
          {nameSearch.length > 0 &&
            (isLoadingSearch ? (
              <div className="flex justify-center items-center mt-10">
                <Loading />
              </div>
            ) : (
              resultSearch.map((user: User, index: number) => (
                <div className="chat-list-detail" key={user.id} onClick={() => handleClickProfile(user)}>
                  <img src={AvatarDefault(user.avatar)} className="chat-list-detail-image" alt="" />
                  <div>
                    <p className="chat-list-detail-name">{user.displayName}</p>
                  </div>
                </div>
              ))
            ))}
          {/* Default Conversation */}
          {nameSearch.length === 0 &&
            conversationGetAllDTO.map((item: ConversationGetAllDTO, index: number) => {
              const { id, name, messageDTO } = item;
              const { avatar, displayName, type, text, userId } = messageDTO;
              return (
                <div className="chat-list-detail" key={id} onClick={() => handleClickConversation(item)}>
                  <img src={AvatarDefault(avatar)} className="chat-list-detail-image" alt="" />
                  <div>
                    <p className="chat-list-detail-name">{displayName}</p>
                    <p className="chat-list-detail-message">{`${userId === profile.id ? `Bạn: ${text}` : `${text}`}`}</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="chat-divide" />
        {conversationDetailDTO === undefined ? (
          <div className="chat-null">Hãy chọn một đoạn chat</div>
        ) : (
          <div className="chat-detail" ref={refConversation}>
            <div className="chat-detail-head">
              <button className="chat-detail-arrow-left hidden" onClick={handleClickArrowLeft}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <img src={ConversationFindUserOtherImage(conversationDetailDTO.users, profile.id)} className="chat-detail-image" alt="" />
              <p className="chat-detail-name">{ConversationFindUserOther(conversationDetailDTO.users, profile.id)?.displayName}</p>
            </div>
            <div className="chat-detail-content">
              {isLoading ? (
                <div className="chat-detail-load">
                  <ReactLoading type={"spin"} color="#000" width={30} height={30} />
                </div>
              ) : (
                <div id="scrollableDiv" className="chat-detail-message">
                  <InfiniteScroll
                    scrollableTarget="scrollableDiv"
                    dataLength={messageDTO.length}
                    next={handleNextDataMessage}
                    style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                    inverse={true}
                    hasMore={hasMore}
                    loader={
                      <div className="chat-detail-load">
                        <ReactLoading type={"spin"} color="#000" width={30} height={30} />
                      </div>
                    }>
                    {messageDTO.map((item: MessageDTO, index: number) => (
                      <Message users={conversationDetailDTO?.users} item={item} key={item.id} />
                    ))}
                  </InfiniteScroll>
                </div>
              )}
            </div>
            <div className="chat-detail-input flex justify-center">
              <input type="file" className="hidden" ref={refFile} onChange={handleFile} accept="image/*" />
              <button className="chat-detail-select-img" onClick={handleClickButtonFile}>
                <i className="fa-solid fa-image"></i>
              </button>
              <Input text={text} setText={setText} type="text" placeholder="Gửi tin nhắn" callBackFocus={() => handleSendMessage("text", text)} />
              <button className="chat-detail-send" onClick={() => handleSendMessage("text", text)}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      {isVisible && <UpdateProfile setIsVisible={setIsVisible} />}
    </Modal>
  );
};

export default Conversation;
