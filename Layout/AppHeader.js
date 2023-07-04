import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import classes from "./AppHeader.module.css";
import {
  HiOutlineHome,
  HiPlus,
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
} from "react-icons/hi";
import { TbWallet } from "react-icons/tb";
import LoginPopup from "../components/LoginPopup";
import NewPosterPopup from "../components/NewPosterPopup";
import { states } from "../data/province/Province";
import Link from "next/link";
import { useRouter } from "next/router";

const AppHeader = () => {
  const [city, setCity] = useState("تهران");
  const [showCities, setShowCities] = useState(false);
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  return (
    <>
      {auth?.showLoginPopup && <LoginPopup />}
      {auth?.showNewPosterPopup && <NewPosterPopup />}

      <div className={classes.header}>
        <div className={classes.header_layout}>
          <div
            className={`${classes.all_cities_container} ${
              showCities ? classes.active : ""
            }`}
          >
            {states.map((s) => (
              <div
                key={s.name}
                className={classes.city_container}
                style={{ justifyContent: "center" }}
                onClick={() => {
                  setCity(s.name);
                  setShowCities(false);
                }}
              >
                {s.name}
              </div>
            ))}
          </div>
          <div className={classes.header_right}>
            <Link href="/">
              <h1 className={classes.header_logo}>همینجاست</h1>
            </Link>
            {/* <hr className={classes.divider} />
            <div
              className={classes.city_container}
              onClick={() => {
                setShowCities(!showCities);
              }}
            >
              <HiOutlineLocationMarker width={10} color="rgba(0, 0, 0, 0.56)" />
              {city}
            </div> */}
          </div>
          <div className={classes.header_left}>
            <Link
              className={`${classes.menu_item} ${
                router.pathname === "/my-wallet" ? classes.active : ""
              }`}
              href="/my-wallet"
            >
              <div className={classes.header_menu_items}>
                <TbWallet width={10} color="rgba(0, 0, 0, 0.56)" />
                کیف پول
              </div>
            </Link>
            <Link
              className={`${classes.menu_item} ${
                router.pathname === "/my-posters" ? classes.active : ""
              }`}
              href="/my-posters"
            >
              <div
                className={classes.header_menu_items}
                style={{ whiteSpace: "pre" }}
              >
                <HiOutlineViewGrid width={10} color="rgba(0, 0, 0, 0.56)" />
                آگهی های من
              </div>
            </Link>
            <Link
              className={`${`${classes.menu_item} ${
                router.pathname === "/posters" ? classes.active : ""
              }`} ${classes.home}`}
              href="/posters"
            >
              <div className={classes.header_menu_items}>
                <HiOutlineHome width={10} color="rgba(0, 0, 0, 0.56)" />
                خانه
              </div>
            </Link>
            <Link
              className={`${classes.menu_item} ${
                router.pathname.includes("chat") ? classes.active : ""
              }`}
              href="/chat"
            >
              <div className={classes.header_menu_items}>
                <HiOutlineChatAlt2 width={10} color="rgba(0, 0, 0, 0.56)" />
                چت
              </div>
            </Link>
            {console.log(router.pathname)}
            <div
              className={classes.add_poster_btn}
              onClick={() => {
                if (auth?.token) {
                  setAuth({ ...auth, showNewPosterPopup: true });
                } else {
                  setAuth({ ...auth, showLoginPopup: true });
                }
              }}
            >
              ثبت آگهی
              <HiPlus width={10} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
