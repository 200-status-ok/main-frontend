import classes from "./LoginPopup.module.css";
import Image from "next/image";
import userIcon from "../assets/icons/user.png";
import leftdots from "../assets/images/leftdots.png";
import nine_dots from "../assets/images/ninedots.png";
import googleIcon from "../assets/icons/google.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
const LoginPopup = ({ setUser, setShowLoginPopup }) => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={classes.code_input_container}>
              <input
                className={classes.code_input}
                placeholder="کد تایید"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className={classes.code_button}
                onClick={async () => {
                  await axios.post(
                    "https://main-backend.iran.liara.run/api/v1/users/auth/otp/send",
                    {
                      username,
                    }
                  );
                  toast.success("کد با موفقیت ارسال شد");
                }}
              >
                ارسال
              </button>
            </div>
          </div>
          <div className={classes.mid_dots}>
            <Image src={nine_dots} width="70" />
          </div>
          <div className={classes.buttons_container}>
            <button
              className={classes.login_button}
              onClick={async () => {
                const response = await axios.post(
                  "https://main-backend.iran.liara.run/api/v1/users/auth/otp/login",
                  {
                    username,
                    otp,
                  }
                );
                setUser(response.data);
                setShowLoginPopup(false);
                console.log(response.data);
              }}
            >
              ورود
            </button>
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
