import classes from "./Header.module.css";
import leftdots from "../assets/images/leftdots.png";
import Image from "next/image";
import { useRef, useState } from "react";
import LoginPopup from "../components/LoginPopup";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useAuth } from "../context/AuthProvider";
const Header = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { auth, setAuth } = useAuth();
  return (
    <>
      {showLoginPopup && <LoginPopup setShowLoginPopup={setShowLoginPopup} />}
      <div className={classes.container}>
        <div className={classes.title_container}>
          <h1 className={classes.subheader}>دنبالش نگرد...</h1>
          <h2 className={classes.header_title}>همینجاست</h2>
        </div>
        <ul className={classes.nav_menu}>
          <Link href="/posters">
            <li>آگهی ها</li>
          </Link>
          <li>پیشنهادات شما</li>
          <li>درباره ما</li>
        </ul>
        <div className={classes.dots}>
          <Image src={leftdots} width="250" />
        </div>
        {auth?.token ? (
          <button
            className={classes.button}
            onClick={() => {
              setAuth({});
              setCookie("token", "");
            }}
          >
            خروج
          </button>
        ) : (
          <button
            className={classes.button}
            onClick={() => {
              setShowLoginPopup(true);
            }}
          >
            ورود
          </button>
        )}
      </div>
    </>
  );
};

export default Header;
