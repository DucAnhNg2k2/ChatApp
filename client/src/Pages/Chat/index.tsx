import lodash from "lodash";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io, Socket } from "socket.io-client";
import { requestGetMembers, requestGetProfile } from "../../api/auth";
import { requestConversationCreate, requestConversationGetById, requestConversationGetByMember, requestConversationPage, requestMessageCreate, requestMessageGet } from "../../api/chat";
import Input from "../../Component/Input";
import Loading from "../../Component/Loading";
import Message from "../../Component/message";
import Modal from "../../Component/Modal";
import UpdateProfile from "../../Component/update-profile";
import { HOST_SERVER, PORT_SERVER_SOCKET, SUBSCRIBE_MESSAGE } from "../../config/config";
import { toastObject } from "../../config/toast";
import { colors } from "../../const/colors";
import { typeMessage } from "../../enum/message-type.enum";
import { isResponseSuccess } from "../../helper/reponse.success";
import { AppDispatch, RootState } from "../../Store";
import { setProfile } from "../../Store/Profile";
import { ConversationListType } from "../../type/conversation-list-type";
import { ConversationType } from "../../type/conversation-type";
import { MembersChat } from "../../type/member-type";
import { MessageChat } from "../../type/message-type";
import { getAvatar } from "../../utils/avatar.utils";
import { getMemberMeInConversation, getMemberOtherInConversation, isCreatedMessage } from "../../utils/conversation.utils";
import { profileValidate } from "../../utils/profile-validate.utils";
import "./chat.scss";
import { MessageCreateDto } from "./dto/message-create.dto";
import { requestUploadFile } from "../../api/file";

const SIZE = 15;
const Conversation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.token).value;
  const profile = useSelector((state: RootState) => state.profile).data;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [message, setMessage] = useState<MessageChat[]>([]);
  const [text, setText] = useState<string>("");

  const [conversation, setConversation] = useState<ConversationType>();
  const [conversationList, setConversationList] = useState<ConversationListType[]>([]);

  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [nameSearch, setNameSearch] = useState("");
  const [members, setMembers] = useState<MembersChat[]>([]);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [page, setPage] = React.useState<number>(0);
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [isVisiblePopUpProfile, setIsVisiblePopUpProfile] = useState<boolean>(false);

  const refFile = React.useRef<HTMLInputElement>(null);
  const refConversation = React.useRef<HTMLDivElement>(null);

  const loadDataConversation = async () => {
    try {
      const resListConversations = await requestConversationPage(token);
      if (isResponseSuccess(resListConversations) && resListConversations.data) {
        const dataListConversations = resListConversations.data;
        setConversationList(dataListConversations);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    loadDataConversation();
  }, []);

  const handleUpdateConversationWhenReceiveMessage = (data: MessageChat) => {
    // Push conversation to top
    const { conversationId } = data;
    const conversation = conversationList.find(item => item._id === conversationId);
    if (!conversation) {
      return;
    }
    conversation.lastMessage = data;
    const newConversation = [conversation, ...conversationList.filter(item => item._id !== conversationId)];
    setConversationList(newConversation);
  };
  const handleReceiveMessage = (data: MessageChat) => {
    setMessage(pre => [data, ...pre]);
    handleUpdateConversationWhenReceiveMessage(data);
  };
  const handleReceiveNewConversation = (data: ConversationType) => {
    // setConversationList(pre => [...pre, { _id: data._id, name: data.name, messages: [] }]);
  };
  const handleInitSocket = async () => {
    try {
      const newSocket = io(`${HOST_SERVER}:${PORT_SERVER_SOCKET}`, {
        transports: ["websocket"],
        query: {
          token,
        },
      });
      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    handleInitSocket();
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on(SUBSCRIBE_MESSAGE.RECEIVE_MESSAGE, handleReceiveMessage);
      socket.on(SUBSCRIBE_MESSAGE.RECEIVE_NEW_CONVERSATION, handleReceiveNewConversation);
    }
  }, [conversationList, conversation]);

  const handleOnLoadProfile = async () => {
    setIsLoading(true);
    const responseProfile = await requestGetProfile(token);
    if (isResponseSuccess(responseProfile) && responseProfile.data) {
      const profile = responseProfile.data;
      dispatch(setProfile(profile));
      setIsVisiblePopUpProfile(!profileValidate(profile));
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleOnLoadProfile();
  }, []);
  useEffect(() => {
    setIsVisiblePopUpProfile(!profileValidate(profile));
  }, [profile]);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files;
      if (!file) {
        return;
      }
      const responseFile = await requestUploadFile(token, file[0]);
      if (isResponseSuccess(responseFile) && responseFile.data) {
        handleSendMessage({
          content: responseFile.data.url,
          typeMessage: typeMessage.IMAGE,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSendMessage = async (data: Omit<MessageCreateDto, "conversationId">) => {
    try {
      if (!conversation) {
        toast.error("Chưa chọn cuộc trò chuyện", toastObject);
        return;
      }
      let conversationTmp: ConversationType = conversation;
      // create-conversation
      if (conversation.isMock) {
        const memberOther = getMemberOtherInConversation(conversation.members, profile.userId);
        if (!memberOther) {
          toast.error("Không tìm thấy người dùng khác trong cuộc trò chuyện", toastObject);
          return;
        }
        const resConversation = await requestConversationCreate(token, memberOther._id);
        if (!isResponseSuccess(resConversation) || !resConversation.data) {
          toast.error("Không tạo được cuộc trò chuyện", toastObject);
          return;
        }
        conversationTmp = resConversation.data;
      }
      const conversationId = conversationTmp?._id;
      const status = requestMessageCreate(socket, { ...data, conversationId });
      if (status) {
        setText("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Responsive mobile set style.left = 0
    if (refConversation && refConversation.current) {
      refConversation.current.style.left = "0%";
    }
  }, [conversation]);

  // Handle Search-Profile
  const handleChangeSearchLodash = React.useMemo(() => {
    return lodash.debounce((name: string) => {
      handleSearchUser(name);
    }, 300);
  }, []);
  const handleSearchUser = async (name: string) => {
    setIsLoadingSearch(true);
    try {
      const resMembers = await requestGetMembers(token, name);
      if (isResponseSuccess(resMembers) && resMembers.data) {
        setMembers(resMembers.data);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoadingSearch(false);
  };
  const handleChangeSearch = (e: any) => {
    const name: string = e.target.value;
    setNameSearch(name);
    name.length === 0 ? setMembers([]) : handleChangeSearchLodash(name);
  };

  const handleGetMessages = async (conversation: ConversationType) => {
    try {
      const resMessage = await requestMessageGet(token, conversation._id);
      if (isResponseSuccess(resMessage) && resMessage.data) {
        const data: MessageChat[] = resMessage.data;
        setMessage(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClickMember = async (member: MembersChat) => {
    setIsLoading(true);
    try {
      const res = await requestConversationGetByMember(token, member);
      if (isResponseSuccess(res) && res.data) {
        const data: ConversationType = res.data;
        setConversation(data);
        if (data._id) {
          await handleGetMessages(data);
        }
      }
      setNameSearch("");
    } catch (err) {}
    setIsLoading(false);
  };

  const handleClickConversation = async (item: ConversationListType) => {
    if (conversation?._id === item._id) return;
    setIsLoading(true);
    try {
      const res = await requestConversationGetById(token, item._id);
      if (isResponseSuccess(res) && res.data) {
        const data: ConversationType = res.data;
        setConversation(data);
        await handleGetMessages(data);
      }
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const handleNextDataMessage = async () => {
    try {
      // console.log("Fetch More Message !!");
      // const cid = conversationDetailDTO?.id;
      // if (cid) {
      //   const newPage = page + 1;
      //   const resMessage: ResponseType = (await requestGetMessage(cid, token, newPage, SIZE)).data;
      //   if (resMessage.statusCode === 200) {
      //     const data: MessageDTO[] = resMessage.data;
      //     if (data.length === 0) {
      //       setHasMore(false);
      //     } else {
      //       setMessageDTO([...messageDTO, ...data]);
      //       setPage(newPage);
      //     }
      //   }
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickButtonFile = () => {
    if (refFile.current) {
      refFile.current.click();
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
            <img src={`${getAvatar(profile.avatar)}`} className="chat-profile-img" alt="" />
            <div>
              <p className="chat-profile-name"> {profile.name} </p>
              <button className="chat-profile-edit" onClick={() => setIsVisiblePopUpProfile(true)}>
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
              members.map((user: MembersChat, index: number) => (
                <div className="chat-list-detail" key={user._id} onClick={() => handleClickMember(user)}>
                  <img src={getAvatar(user.avatar)} className="chat-list-detail-image" alt="" />
                  <div>
                    <p className="chat-list-detail-name">{user.name}</p>
                  </div>
                </div>
              ))
            ))}
          {!nameSearch.length &&
            conversationList.map((item: ConversationListType, index: number) => {
              const { _id, name, avatar, lastMessage, members } = item;
              const getMemberMe = getMemberMeInConversation(members, profile.userId);
              const isCreateMessage = isCreatedMessage(lastMessage, getMemberMe);

              const contentMessage = (function () {
                switch (lastMessage.type) {
                  case typeMessage.TEXT:
                    return isCreateMessage ? `Bạn: ${lastMessage.content}` : lastMessage.content;
                  case typeMessage.IMAGE:
                    return isCreateMessage ? "Bạn: đã gửi một hình ảnh" : "Đã gửi một hình ảnh";
                  default:
                    return "";
                }
              })();

              return (
                <div className="chat-list-detail" key={_id} onClick={() => handleClickConversation(item)}>
                  <img src={getAvatar(avatar)} className="chat-list-detail-image" alt="" />
                  <div>
                    <p className="chat-list-detail-name">{name}</p>
                    <p className="chat-list-detail-message">{contentMessage}</p>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="chat-divide" />
        {!conversation ? (
          <div className="chat-null">Hãy chọn một đoạn chat</div>
        ) : (
          <div className="chat-detail" ref={refConversation}>
            <div className="chat-detail-head">
              <button className="chat-detail-arrow-left hidden" onClick={handleClickArrowLeft}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <img src={getAvatar(conversation.avatar)} className="chat-detail-image" alt="" />
              <p className="chat-detail-name">{conversation.name}</p>
            </div>
            <div className="chat-detail-content">
              {isLoading ? (
                <div className="chat-detail-load">
                  <ReactLoading type={"spin"} color={colors.black} width={30} height={30} />
                </div>
              ) : (
                <div id="scrollableDiv" className="chat-detail-message">
                  <InfiniteScroll
                    scrollableTarget="scrollableDiv"
                    dataLength={message.length}
                    next={handleNextDataMessage}
                    style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                    inverse={true}
                    hasMore={hasMore}
                    loader={
                      <div className="chat-detail-load">
                        <ReactLoading type={"spin"} color={colors.black} width={30} height={30} />
                      </div>
                    }>
                    {message.map((item: MessageChat, index: number) => (
                      <Message message={item} key={item._id} conversation={conversation} />
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
              <Input
                text={text}
                setText={setText}
                type="text"
                placeholder="Gửi tin nhắn"
                callBackFocus={() =>
                  handleSendMessage({
                    content: text,
                    typeMessage: typeMessage.TEXT,
                  })
                }
              />
              <button
                className="chat-detail-send"
                onClick={() =>
                  handleSendMessage({
                    content: text,
                    typeMessage: typeMessage.TEXT,
                  })
                }>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>
      {isVisiblePopUpProfile && <UpdateProfile setIsVisible={setIsVisiblePopUpProfile} />}
    </Modal>
  );
};

export default Conversation;
