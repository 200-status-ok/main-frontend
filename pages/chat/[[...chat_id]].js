/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import AppHeader from "../../Layout/AppHeader";
import classes from "./Chat.module.css";
import bicycle from "../../assets/images/bicycle.png";
import ChatItem from "../../components/ChatItem";
import { HiOutlinePaperAirplane, HiArrowSmRight } from "react-icons/hi";
import { BiImageAdd } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import axios, { all } from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/router";
import { w3cwebsocket } from "websocket";
import Link from "next/link";
import { http } from "../../http-services/http";
import { HiOutlineMap, HiOutlineMapPin } from "react-icons/hi2";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
let chatId;
let allChat;
const MapWithNoSsrNewPoster = dynamic(
  () => import("../../components/NewPosterMap"),
  {
    ssr: false,
  }
);
const Chat = () => {
  const [allChats, setAllChats] = useState([]);
  const [activeChat, setActiveChat] = useState();
  const [chatText, setChatText] = useState("");

  const [locationPopup, setLocationPopup] = useState(false);
  const [location, setLocation] = useState();

  const dummy = useRef();
  const [owner, setOwner] = useState([{ id: 0, is_owner: false }]);
  const { auth, setAuth } = useAuth();

  const [connection, setConnection] = useState();

  const [ownerId, setOwnerId] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);

  const [isConnectionOpen, setIsConnectionOpen] = useState(false);

  const imageRef = useRef();
  const router = useRouter();

  const createConnection = () => {
    const websocket = new w3cwebsocket(
      `ws://localhost:8080/api/v1/chat/open-ws?token=${auth.token}`
    );
    websocket.onopen = (event) => {
      console.log(event);
      setConnection(websocket);
    };
    websocket.onmessage = (event) => {
      if (!event.data.includes("User")) {
        const message = JSON.parse(event.data);

        if (+message.conversation_id === +chatId) {
          setChatHistory((prev) => [...prev, message]);
        }
        const newAllChats = [...allChat];
        const selectedChat = newAllChats.find(
          (chat) => chat.id === message.conversation_id
        );
        if (selectedChat) selectedChat.description = message.content;
        setAllChats(newAllChats);
      }

      // if (chatId) {
      //   fetchChatHistory(chatId);
      // }
      console.log(event);
    };
    websocket.onclose = (event) => {
      console.log(event);
      console.log("closed connection");
      // createConnection();
    };
    websocket.onerror = (event) => {
      console.log(event);
    };
  };

  useEffect(() => {
    if (auth.token) {
      if (!connection) {
        console.log("create connection");
        createConnection();
      }
    }
  }, [auth]);
  console.log(allChats);

  useEffect(() => {
    if (auth)
      if (!auth.token && !auth.showLoginPopup)
        setAuth((prev) => ({ ...prev, showLoginPopup: true }));
    if (auth.token) {
      (async () => {
        const { data } = await http.get("/api/v1/chat/authorize/conversation", {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        });
        if (data) {
          setAllChats(data);
          allChat = data;
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
    if (router?.query?.chat_id) {
      chatId = router?.query?.chat_id[0];
      if (allChats.length > 0) {
        const currentActiveChat = allChats.find(
          (chat) => chat.id === +router.query.chat_id
        );
        setActiveChat(currentActiveChat);
        fetchChatHistory(router.query.chat_id[0]);
      }
    }
  }, [router.query]);

  const fetchChatHistory = async (id) => {
    const { data } = await http.get(
      `/api/v1/chat/authorize/history/${id}?page_id=1&page_size=500`,
      {
        headers: { Authorization: `Bearer ${auth?.token}` },
      }
    );
    const { data: data2 } = await http.get(
      `/api/v1/chat/authorize/conversation/${id}`,
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
    console.log(message);
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
  const sendMessage = (text, type = "text") => {
    if (text) {
      connection.send(
        JSON.stringify({
          content: text,
          type,
          conversation_id: +router.query.chat_id[0],
        })
      );
      // send https request
      const newAllChats = [...allChat];
      const selectedChat = newAllChats.find((chat) => chat.id === +chatId);
      selectedChat.description = text;
      setAllChats(newAllChats);
    }
    setChatText("");
  };
  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage(chatText, "text");
    }
  };
  // useEffect(() => {
  //   if (router?.query?.chat_id) {
  //   }
  // }, [router.query]);
  return (
    <>
      {locationPopup && (
        <div className={classes.location_background}>
          <div className={classes.location_container}>
            <MapWithNoSsrNewPoster />
          </div>
        </div>
      )}
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
                  description={chat?.description ? chat?.description : ""}
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
                          {showMessage(chat.content, chat.type)}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={dummy}></div>
                </div>
                <div className={classes.singlechat_bottom}>
                  <button
                    className={classes.singlechat_bottom_send}
                    onClick={() => {
                      setLocationPopup(true);
                    }}
                  >
                    <HiOutlineMapPin size="28px" color="#2f89fc" />
                  </button>
                  <input
                    type="file"
                    ref={imageRef}
                    style={{ display: "none " }}
                    onChange={async (e) => {
                      if (e.target.files[0]) {
                        const formData = new FormData();
                        formData.append("image", e.target.files[0]);
                        const { data } = await axios.post(
                          "/api/v1/api-call/image-upload",
                          formData
                        );
                        sendMessage(data.url, "image");
                      }
                    }}
                  />
                  <button
                    style={{ marginLeft: "8px" }}
                    className={classes.singlechat_bottom_send}
                    onClick={() => {
                      imageRef.current.click();
                    }}
                  >
                    <BiImageAdd size="28px" color="#2f89fc" />
                  </button>
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
const showMessage = (content, type) => {
  if (type === "image") {
    return <img style={{ width: "200px", height: "200px" }} src={content} />;
  } else if (type === "text") {
    return content;
  } else if (type === "location") {
    return "somthing";
  }
};
export default Chat;
