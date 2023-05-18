import AppHeader from "../Layout/AppHeader";
import classes from "./Chat.module.css";
import bicycle from "../assets/images/bicycle.png";
import ChatItem from "../components/ChatItem";
import { HiOutlinePaperAirplane } from "react-icons/hi";
const Chat = () => {
  return (
    <>
      <AppHeader />
      <div className={classes.container}>
        <div className={classes.chatslist}>
          <div className={classes.chatslist_container}>
            <div className={classes.chatslist_header}>چت های من</div>
            <div className={classes.chatslist_body}>
              <ChatItem description="لورم ایپسوم متن ساختگی با تو ستفاده از طراحان گرافیک است، چاپگرها و" />
              <ChatItem description="یکم متن تستی دیگه برای اینکه بگیم" />
            </div>
          </div>
        </div>
        <div className={classes.singlechat}>
          <div className={classes.singlechat_header}>کاربر همینجاست</div>
          <div className={classes.singlechat_body}>
            <div className={classes.singlechat_top}>
              <div className={classes.singlechat_top_icon}>
                <img src={bicycle.src} />
              </div>
              <div className={classes.singlechat_top_info}>دوچخه گم شده</div>
            </div>
            <div className={classes.singlechat_chat}></div>
            <div className={classes.singlechat_bottom}>
              <input placeholder="متنی بنویسید ..." />
              <button className={classes.singlechat_bottom_send}>
                <HiOutlinePaperAirplane size="28px" color="#2f89fc" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
