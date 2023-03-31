import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import LoginPopup from "../components/LoginPopup";
export default function Home() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  return (
    <>
      {showLoginPopup && <LoginPopup setShowLoginPopup={setShowLoginPopup} />}
      <div className={styles.container}>
        <button
          onClick={() => {
            setShowLoginPopup(true);
          }}
        >
          click me
        </button>
      </div>
    </>
  );
}
