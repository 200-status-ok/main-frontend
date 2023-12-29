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
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/router";
import { w3cwebsocket } from "websocket";
import Link from "next/link";
import { http } from "../../http-services/http";
import { HiOutlineMapPin } from "react-icons/hi2";
import dynamic from "next/dynamic";
import RenderResult from "next/dist/server/render-result";
import { BsJournal } from "react-icons/bs";
let chatId;
let allChat;
const ChatMap = dynamic(() => import("../../components/ChatMap"), {
  ssr: false,
});
const Chat = () => {
  const [allChats, setAllChats] = useState([]);
  const [activeChat, setActiveChat] = useState();
  const [chatText, setChatText] = useState("");

  const [locationPopup, setLocationPopup] = useState(false);
  const [location, setLocation] = useState({ lat: 35.686023, lng: 51.393045 });

  const dummy = useRef();
  const [owner, setOwner] = useState([{ id: 0, is_owner: false }]);
  const { auth, setAuth } = useAuth();

  const [connection, setConnection] = useState();

  const [currentChatDetail, setCurrentChatDetail] = useState();
  const [chatHistory, setChatHistory] = useState([]);

  const imageRef = useRef();
  const router = useRouter();

  const createConnection = () => {
    const websocket = new w3cwebsocket(
      `wss://main-app.liara.run/api/v1/chat/open-ws?token=${auth.token}`
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
        if (selectedChat) {
          selectedChat.last_message.content = message.content;
          selectedChat.last_message.type = message.type;
        }
        if (+message.conversation_id !== +chatId) selectedChat.unread = true;
        console.log(newAllChats);
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
          const unreadAddedChats = data.map((chat) => ({
            ...chat,
            unread: false,
          }));
          setAllChats(unreadAddedChats);
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

  console.log(activeChat);
  useEffect(() => {
    if (router.query?.poster_id && router?.query.title) {
      setActiveChat({
        name: router?.query.title,
        id: -1,
        image_url:
          "https://main-bucket.s3.ir-thr-at1.arvanstorage.ir/20231228_203444_21030f1e61b7f887.png",
        poster_id: router.query?.poster_id,
        unread: false,
        last_message: {},
      });
      console.log("setting active chat");
    } else if (router?.query?.chat_id?.length > 0) {
      chatId = router?.query?.chat_id[0];
      if (allChats.length > 0) {
        console.log(allChats);
        const currentActiveChat = allChats.find(
          (chat) => chat.id === +router.query.chat_id
        );
        console.log("test");
        currentActiveChat.unread = false;
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

    setCurrentChatDetail(data2.conversation);
    setChatHistory(data.messages.reverse());
  };
  useEffect(() => {
    if (chatHistory.length > 0 && activeChat) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  const checkClassOfMessage = (message, is_owner) => {
    if (is_owner) {
      if (message.receiver_id === currentChatDetail.owner_id) {
        return classes.singlechat_left_message;
      } else {
        return classes.singlechat_right_message;
      }
    } else {
      if (message.receiver_id === currentChatDetail?.owner_id) {
        return classes.singlechat_right_message;
      } else {
        return classes.singlechat_left_message;
      }
    }
  };
  const sendMessage = async (text, type = "text", activeChat = {}) => {
    if (text) {
      console.log(activeChat);
      if (activeChat.id === -1) {
        const { data } = await http.post(
          "/api/v1/chat/authorize/message",
          {
            id: Date.now(),
            content: text,
            conversation_id: -1,
            poster_id: +activeChat.poster_id,
            type,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        router.push(`/chat/${data.conversation_id}`);
      }
      // const senderId = userId;
      // const receiverId =
      //   +currentChatDetail.owner_id === +userId
      //     ? +currentChatDetail.member_id
      //     : +currentChatDetail.owner_id;
      else {
        const { data } = await http.post(
          "/api/v1/chat/authorize/message",
          {
            content: text,
            conversation_id: +router.query.chat_id[0],
            poster_id: currentChatDetail.poster_id,
            id: Date.now(),
            type,
          },
          {
            headers: {
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );
        console.log(data.send_message);
        // send https request
        const newAllChats = [...allChat];
        const selectedChat = newAllChats.find((chat) => chat.id === +chatId);
        selectedChat.last_message.content = text;
        selectedChat.last_message.type = type;

        if (+data.send_message.conversation_id === +chatId) {
          setChatHistory((prev) => [...prev, data.send_message]);
        }
        setAllChats(newAllChats);
      }
    }
    setChatText("");
  };
  const handlePressEnter = (e) => {
    if (e.key === "Enter") {
      sendMessage(chatText, "text", activeChat);
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
            <ChatMap
              latLong={location}
              setLatLong={(latlong) => setLocation(latlong)}
              style={{ width: "100%", height: "240px" }}
            />
            <div className={classes.location_buttons}>
              <div
                className={classes.location_cancel}
                onClick={() => setLocationPopup(false)}
              >
                انصراف
              </div>
              <div
                className={classes.location_send}
                onClick={() => {
                  sendMessage(JSON.stringify(location), "location", activeChat);
                  setLocationPopup(false);
                }}
              >
                ارسال
              </div>
            </div>
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
                  description={showLastMessage(
                    chat?.last_message?.content,
                    chat?.last_message?.type
                  )}
                  image={chat?.image_url}
                  key={index}
                  unread={chat?.unread}
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
                    const date = new Date(chat.id);
                    let hours = date.getHours();
                    let minutes = "0" + date.getMinutes();
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
                        <div className={classes.singlechat_detail_container}>
                          {" "}
                          <div
                            className={classes.singlechat_time}
                          >{`${hours}:${minutes.substr(-2)}`}</div>
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
                        sendMessage(data.url, "image", activeChat);
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
                      sendMessage(chatText, "text", activeChat);
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
    return (
      <ChatMap
        latLong={JSON.parse(content)}
        unClickable
        style={{ width: "250px", height: "200px" }}
      />
    );
  }
};
const showLastMessage = (content, type) => {
  if (type === "text") {
    return content ? content : "بدون پیام";
  } else if (type === "image") {
    return "تصویر";
  } else if (type === "location") {
    return "مکان";
  }
};
export default Chat;
