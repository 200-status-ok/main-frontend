/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import AppHeader from "../../Layout/AppHeader";
import classes from "./Chat.module.css";
import bicycle from "../../assets/images/bicycle.png";
import ChatItem from "../../components/ChatItem";
import { HiOutlinePaperAirplane, HiArrowSmRight } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/router";
import { w3cwebsocket } from "websocket";
import Link from "next/link";

const Chat = () => {
  const [allChats, setAllChats] = useState([]);
  const [activeChat, setActiveChat] = useState();
  const [chatText, setChatText] = useState("");

  const dummy = useRef();
  const [owner, setOwner] = useState([{ id: 0, is_owner: false }]);
  const { auth, setAuth } = useAuth();

  const [connection, setConnection] = useState();

  const [ownerId, setOwnerId] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);

  const [isConnectionOpen, setIsConnectionOpen] = useState(false);
  const router = useRouter();

  const createConnection = () => {
    const websocket = new w3cwebsocket(
      `wss://main-backend.iran.liara.run/api/v1/chats/join?conv_id=${router.query.chat_id}&token=${auth.token}`
    );
    websocket.onopen = (event) => {
      setConnection(websocket);
    };
    websocket.onmessage = (event) => {
      fetchChatHistory(router.query.chat_id);
    };
    websocket.onclose = (event) => {
      console.log(event);
      console.log("closed connection");
      createConnection();
    };
    websocket.onerror = (event) => {
      console.log(event);
    };
  };

  useEffect(() => {
    if (auth)
      if (!auth.token && !auth.showLoginPopup)
        setAuth((prev) => ({ ...prev, showLoginPopup: true }));
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

        if (data) {
          setAllChats(data);
          setOwner(
            data.map((chat) => {
              return { id: chat.id, is_owner: chat.is_owner };
            })
          );
        }
      })();
    }
  }, [auth]);
  useEffect(() => {
    if (router.query.chat_id && allChats?.length > 0) {
      const currentActiveChat = allChats.find(
        (chat) => chat.id === +router.query.chat_id
      );
      connection?.close();
      setActiveChat(currentActiveChat);
      fetchChatHistory(router.query.chat_id);
      createConnection();
    }
  }, [router.query, allChats]);

  const fetchChatHistory = async (id) => {
    const { data } = await axios.get(
      `https://main-backend.iran.liara.run/api/v1/chats/authorize/history/${id}?page_id=1&page_size=500`,
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
    setOwnerId(data2.conversation.owner_id);
    setChatHistory(data.messages.reverse());
  };
  useEffect(() => {
    if (chatHistory.length > 0) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
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
  const sendMessage = () => {
    if (chatText) {
      connection.send(
        JSON.stringify({
          content: chatText,
          type: "text",
        })
      );
    }
    setChatText("");
    const timerId = setTimeout(() => {
      fetchChatHistory(router.query.chat_id);
      clearTimeout(timerId);
    }, 500);
  };
  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };
  return (
    <>
      <AppHeader />
      <div className={classes.container}>
        <div
          className={`${classes.chatslist} ${
            router.query.chat_id ? classes.disabled : ""
          }`}
        >
          <div className={classes.chatslist_container}>
            <div className={classes.chatslist_header}>چت های من</div>
            <div className={classes.chatslist_body}>
              {allChats.map((chat, index) => (
                <ChatItem
                  name={chat.name}
                  description={""}
                  image={chat?.image_url}
                  key={index}
                  onClick={() => {
                    router.push(`/chat/${chat.id}`);
                  }}
                  active={activeChat?.id === chat.id}
                />
              ))}
            </div>
          </div>
        </div>
        <div
          className={`${classes.singlechat} ${
            router?.query?.chat_id ? classes.active : ""
          }`}
        >
          {activeChat ? (
            <>
              <div className={classes.singlechat_header}>
                {router.query.chat_id ? (
                  <Link href="/chat" style={{ width: "30px", height: "30px" }}>
                    <HiArrowSmRight size={30} />
                  </Link>
                ) : (
                  ""
                )}
                کاربر همینجاست{" "}
              </div>
              <div className={classes.singlechat_body}>
                <div className={classes.singlechat_top}>
                  <div className={classes.singlechat_top_icon}>
                    <img
                      src={
                        activeChat?.image_url
                          ? activeChat.image_url
                          : bicycle.src
                      }
                    />
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
                  <div ref={dummy}></div>
                </div>
                <div className={classes.singlechat_bottom}>
                  <input
                    value={chatText}
                    onChange={() => {
                      setChatText(event.target.value);
                    }}
                    onKeyDown={handlePressEnter}
                    placeholder="متنی بنویسید ..."
                  />
                  <button
                    className={classes.singlechat_bottom_send}
                    onClick={() => {
                      sendMessage();
                    }}
                  >
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
