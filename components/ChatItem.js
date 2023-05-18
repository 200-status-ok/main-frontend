import classes from "../pages/Chat.module.css";
import bicycle from "../assets/images/bicycle.png";
const ChatItem = ({ description }) => {
  return (
    <div className={classes.chatslist_chat_item}>
      <div className={classes.chatslist_chat_item_icon}>
        <img src={bicycle.src} />
      </div>
      <div className={classes.chatslist_chat_item_info}>
        <div className={classes.chatslist_chat_item_info_top}>
          دوچرخه گم شده
        </div>
        <div className={classes.chatslist_chat_item_info_down}>
          {" "}
          {description.length > 32
            ? description.slice(0, 32) + "..."
            : description}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
