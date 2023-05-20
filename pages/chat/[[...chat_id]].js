import AppHeader from "../../Layout/AppHeader";
import classes from "./Chat.module.css";
import bicycle from "../../assets/images/bicycle.png";
import ChatItem from "../../components/ChatItem";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/router";
import { w3cwebsocket } from "websocket";

const Chat = () => {
  const [allChats, setAllChats] = useState([]);
  const [activeChat, setActiveChat] = useState();
  const [owner, setOwner] = useState([{ id: 0, is_owner: false }]);
  const { auth, setAuth } = useAuth();

  const [ownerId, setOwnerId] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);

  const [isConnectionOpen, setIsConnectionOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (auth.token) {
      (async () => {
        const { data } = await axios.get(
          "https://main-backend.iran.liara.run/api/v1/chats/authorize/conversations",
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );

        setAllChats(data);
        setOwner(
          data.map((chat) => {
            return { id: chat.id, is_owner: chat.is_owner };
          })
        );
      })();
    }
  }, [auth.token]);
  useEffect(() => {
    if (router.query.chat_id && isConnectionOpen === false) {
      setIsConnectionOpen(true);
    }
  }, [router.query]);

  const fetchChatHistory = async (id) => {
    const { data } = await axios.get(
      `https://main-backend.iran.liara.run/api/v1/chats/authorize/history/${id}?page_id=1&page_size=10`,
      {
        headers: { Authorization: `Bearer ${auth?.token}` },
      }
    );
    const { data: data2 } = await axios.get(
      `https://main-backend.iran.liara.run/api/v1/chats/authorize/conversation/${id}`,
      {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      }
    );
    console.log(data2);
    setOwnerId(data2.conversation.owner_id);
    setChatHistory(data.messages.reverse());
  };

  console.log(ownerId);
  console.log(owner);

  const checkClassOfMessage = (message, is_owner) => {
    if (is_owner) {
      if (message.receiver_id === ownerId) {
        return classes.singlechat_left_message;
      } else {
        return classes.singlechat_right_message;
      }
    } else {
      if (message.receiver_id === ownerId) {
        return classes.singlechat_right_message;
      } else {
        return classes.singlechat_left_message;
      }
    }
  };

  return (
    <>
      <AppHeader />
      <div className={classes.container}>
        <div className={classes.chatslist}>
          <div className={classes.chatslist_container}>
            <div className={classes.chatslist_header}>چت های من</div>
            <div className={classes.chatslist_body}>
              <button
                onClick={() => {
                  // const websocket = new WebSocket(
                  //   `ws://main-backend.iran.liara.run/api/v1/chats/join?conv_id=3&token=${auth.token}`
                  // );
                  // websocket.onopen = (event) => {
                  //   console.log(event);
                  // };
                  // websocket.onmessage = (event) => {
                  //   console.log(event);
                  // };
                  // websocket.onclose = (event) => {
                  //   console.log(event);
                  //   event.target.onopen((event) => {
                  //     console.log(event);
                  //   });
                  // };
                  // websocket.onerror = (event) => {
                  //   console.log(event);
                  // };
                }}
              >
                تست
              </button>
              {allChats.map((chat, index) => (
                <ChatItem
                  name={chat.name}
                  description={chat.name}
                  image={chat?.image_url}
                  key={index}
                  onClick={() => {
                    fetchChatHistory(chat.id);
                    setActiveChat(chat);
                  }}
                  active={activeChat?.id === chat.id}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={classes.singlechat}>
          {activeChat ? (
            <>
              <div className={classes.singlechat_header}>کاربر همینجاست</div>
              <div className={classes.singlechat_body}>
                <div className={classes.singlechat_top}>
                  <div className={classes.singlechat_top_icon}>
                    <img src={bicycle.src} />
                  </div>
                  <div className={classes.singlechat_top_info}>
                    {activeChat?.name}
                  </div>
                </div>
                <div className={classes.singlechat_chat}>
                  {chatHistory?.map((chat, index) => {
                    return (
                      <div
                        className={`${checkClassOfMessage(
                          chat,
                          owner.find((item) => item.id === chat.conversation_id)
                            .is_owner
                        )}`}
                        key={index}
                      >
                        <div className={classes.singlechat_chat_item_text}>
                          {chat.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={classes.singlechat_bottom}>
                  <input placeholder="متنی بنویسید ..." />
                  <button className={classes.singlechat_bottom_send}>
                    <HiOutlinePaperAirplane size="28px" color="#2f89fc" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
