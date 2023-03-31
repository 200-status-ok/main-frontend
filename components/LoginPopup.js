import classes from "./LoginPopup.module.css";
import Image from "next/image";
import userIcon from "../assets/icons/user.png";
import leftdots from "../assets/images/leftdots.png";
import nine_dots from "../assets/images/ninedots.png";
import googleIcon from "../assets/icons/google.png";
const LoginPopup = () => {
  return (
    <>
      <div className={classes.background}>
        <div className={classes.popup_container}>
          <div className={classes.title_container}>
            <div className={classes.title_right}>
              <Image src={userIcon} width="32" height="32" />
              <h1>ورود</h1>
            </div>
            <Image src={leftdots} width="200" />
          </div>
          <p className={classes.under_title}>برای ادامه وارد سایت شو</p>
          <div className={classes.inputs_container}>
            <input
              className={classes.email_input}
              placeholder="ایمیل یا شماره موبایل"
            />
            <div className={classes.code_input_container}>
              <input className={classes.code_input} placeholder="کد تایید" />
              <button className={classes.code_button}>ارسال</button>
            </div>
          </div>
          <div className={classes.mid_dots}>
            <Image src={nine_dots} width="70" />
          </div>
          <div className={classes.buttons_container}>
            <button className={classes.login_button}>ورود</button>
            <button className={classes.gLogin_button}>
              <Image
                src={googleIcon}
                width="24"
                height="24"
                className={classes.google_icon}
              />
              ورود با گوگل
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPopup;
