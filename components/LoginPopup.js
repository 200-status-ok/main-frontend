import classes from "./LoginPopup.module.css";
import Image from "next/image";
import userIcon from "../assets/icons/user.png";
import leftdots from "../assets/images/leftdots.png";
import nine_dots from "../assets/images/ninedots.png";
import googleIcon from "../assets/icons/google.png";
import axios from "axios";
import { toast } from "react-toastify";
import { setCookie, getCookie } from "cookies-next";
import { useState, useRef } from "react";
import useOnClickOutside from "../hooks/useOutside";
import { useTimer } from "react-timer-hook";
import { useAuth } from "../context/AuthProvider";
const LoginPopup = ({ setShowLoginPopup }) => {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const { auth, setAuth } = useAuth();
  const loginBoxRef = useRef();
  const [disable, setDisable] = useState(false);
  const [showSendCode, setShowSendCode] = useState(true);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 119);
  const Otp_timer = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      setShowSendCode(true);
      setDisable(false);
    },
  });
  console.log(Otp_timer);
  useOnClickOutside(loginBoxRef, () => {
    setShowLoginPopup(false);
  });

  return (
    <>
      <div className={classes.background}>
        <div className={classes.popup_container} ref={loginBoxRef}>
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
              disabled={disable}
              onChange={(e) => {
                if (not_persian(e.target.value)) {
                  setUsername(e.target.value);
                }
              }}
            />
            <div className={classes.code_input_container}>
              <input
                className={classes.code_input}
                placeholder="کد تایید"
                value={otp}
                onChange={(e) => {
                  if (e.target.value.length < 7) {
                    setOtp(e.target.value);
                  }
                }}
                type="number"
              />
              <button
                className={classes.code_button}
                onClick={async () => {
                  try {
                    if (
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                        username
                      )
                    ) {
                      await axios.post(
                        "https://main-backend.iran.liara.run/api/v1/users/auth/otp/send",
                        {
                          username,
                        }
                      );
                      const timer = new Date();
                      timer.setSeconds(timer.getSeconds() + 119);
                      Otp_timer.restart(timer);
                      setShowSendCode(false);
                      toast.success("کد با موفقیت ارسال شد");
                      setDisable(true);
                    } else {
                      if (
                        /^(9|09)(12|19|35|36|37|38|39|32|03|02|21)\d{7}$/.test(
                          username
                        )
                      ) {
                        await axios.post(
                          "https://main-backend.iran.liara.run/api/v1/users/auth/otp/send",
                          {
                            username,
                          }
                        );
                        toast.success("کد با موفقیت ارسال شد");
                        const timer = new Date();
                        timer.setSeconds(timer.getSeconds() + 119);
                        Otp_timer.restart(timer);
                        setShowSendCode(false);
                        setDisable(true);
                      } else {
                        toast.error(
                          "لطفا یک ایمیل یا شماره موبایل معتبر وارد کنید"
                        );
                      }
                    }
                  } catch (error) {
                    toast.error("مشکلی در اتصال به بکند پیش آمده است");
                  }
                }}
              >
                {showSendCode
                  ? "ارسال"
                  : Otp_timer.minutes + ":" + Otp_timer.seconds}
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
                if (otp.length !== 6) {
                  toast.error("کد وارد شده اشتباه است");
                } else {
                  try {
                    const response = await axios.post(
                      "https://main-backend.iran.liara.run/api/v1/users/auth/otp/login",
                      {
                        username,
                        otp,
                      }
                    );
                    setAuth({ token: response.data });
                    setCookie("token", response.data.token);
                    console.log(response.data);
                    toast.success("با موفقیت وارد شدید");
                    setShowLoginPopup(false);
                    console.log(response.data);
                  } catch (error) {
                    if (error?.response?.data?.error?.includes("invalid")) {
                      toast.error("کد وارد شده اشتباه است");
                    } else if (
                      error?.response?.data?.error?.includes("redis")
                    ) {
                      toast.error("کد منقضی شده است ، مجدد تلاش کنید");
                    } else {
                      toast.error("مشکلی در اتصال به بکند پیش آمده است");
                    }
                  }
                }
              }}
            >
              ورود
            </button>
            <a
              className={classes.gLogin_button}
              href="https://main-backend.iran.liara.run/api/v1/users/auth/google/login"
            >
              <Image
                src={googleIcon}
                width="24"
                height="24"
                className={classes.google_icon}
              />
              ورود با گوگل
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPopup;
const not_persian = (char) => {
  var p = /^[\u0600-\u06FF\s]+$/;
  if (!p.test(char)) {
    return true;
  } else {
    return false;
  }
};
