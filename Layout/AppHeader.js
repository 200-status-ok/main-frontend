import classes from "./AppHeader.module.css";
import {
  HiOutlineLocationMarker,
  HiPlus,
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
} from "react-icons/hi";
const AppHeader = () => {
  return (
    <div className={classes.header}>
      <div className={classes.header_layout}>
        <div className={classes.header_right}>
          <h1 className={classes.header_logo}>همینجاست</h1>
          <hr className={classes.divider} />
          <div className={classes.city_container}>
            <HiOutlineLocationMarker width={10} color="rgba(0, 0, 0, 0.56)" />
            تهران
          </div>
        </div>
        <div className={classes.header_left}>
          <div className={classes.header_menu_items}>
            <HiOutlineViewGrid width={10} color="rgba(0, 0, 0, 0.56)" />
            آگهی های من
          </div>
          <div className={classes.header_menu_items}>
            <HiOutlineChatAlt2 width={10} color="rgba(0, 0, 0, 0.56)" />
            چت
          </div>
          <div className={classes.add_poster_btn}>
            ثبت آگهی
            <HiPlus width={10} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
