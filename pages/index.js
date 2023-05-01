import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import LoginPopup from "../components/LoginPopup";
import classes from "./Home.module.css";
import IranMap from "../assets/images/IranMap.png";
import Header from "../Layout/Header";
import manydots from "../assets/images/manydots.png";
import downchevron from "../assets/icons/down_chevron.png";
import leftdots from "../assets/images/leftdots.png";
import plus from "../assets/icons/plus.png";
import dots from "../assets/images/dots.png";
import bicycle from "../assets/images/bicycle.png";
import toodots from "../assets/images/toodots.png";
import leftchevron from "../assets/icons/left_chevron.png";
import Layout from "../Layout/Layout";
import Poster from "../components/Poster";
import Link from "next/link";
import axios from "axios";
export default function Home() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [search, setSearch] = useState(" ");
  const [allPosters, setAllPosters] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        "https://main-backend.iran.liara.run/api/v1/posters/?page_id=1&page_size=10&status=both"
      );
      setAllPosters(data);
    })();
  }, []);
  return (
    <Layout>
      <div className={classes.hero}>
        <div className={classes.hero_text_container}>
          <div className={classes.hero_text}>
            {" "}
            هر جای ایران، هر چیزی که گم کردی <b> ثبتش کن </b> الگوریتم های
            <b> جستجوی </b> ما هر لحظه که آگهی مشابهی تو سامانه ثبت بشه،{" "}
            <b> باخبرت میکنه </b>
          </div>
          <button className={classes.hero_button}>چیزی گم کردی؟</button>
        </div>
        <Image className={classes.hero_image} src={IranMap} width={650} />
        <Image className={classes.hero_dots_up} src={manydots} width={550} />
        <Image className={classes.hero_dots_down} src={manydots} width={550} />
        <div className={classes.hero_subtext_container}>
          <p className={classes.hero_subtext_up}>چیزی پیدا کردی؟</p>
          <p className={classes.hero_subtext_down}>مرسی که ثبتش میکنی</p>
        </div>
      </div>
      <div className={classes.cta} id="cta">
        <div className={classes.chevron_container}>
          <a href="#cta">
            <Image src={downchevron} width={30} />
          </a>
        </div>
        <div className={classes.cta_text}>
          بین آگهی های ثبت شده <b> جستجو کن </b>، شاید گمشده ات رو یکی پیدا کرده
          باشه اگه گمشده ات رو بین آگهی ها پیدا نکردی، <b> ثبتش کن </b>
        </div>
        <div className={classes.cta_input_container}>
          <input
            placeholder="چی گم کردی ؟ مثلا کیف پول"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link
            href={`/posters?search=${search}`}
            className={classes.cta_input_container_button}
          >
            بگرد
          </Link>
          <div className={classes.cta_button_container}>
            <button className={classes.cta_button}>
              <Image src={plus} width={30} />
              ثبت آگهی
            </button>
            <Image src={dots} width={100} />
          </div>
        </div>
        <Image className={classes.cta_dots} src={leftdots} width={350} />
      </div>
      <div className={classes.posters}>
        <div className={classes.posters_title}>آخرین آگهی ها</div>
        <div className={classes.posters_container}>
          {console.log(allPosters)}
          {allPosters.slice(0, 3).map((poster) => (
            <Link href={`/poster/${poster.id}`}>
              <Poster
                key={poster.id}
                title={poster.title}
                description={poster.description}
                image={
                  poster.images.length > 0 ? poster.images[0].url : bicycle.src
                }
                found={poster.status === "found"}
                lost={poster.status === "lost"}
                location={poster.address[0].address_detail}
                time_description="3 دقیقه پیش"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className={classes.more}>
        <Image src={toodots} width={1140} />
        <div className={classes.more_button_container}>
          <Link href="/posters">
            <button className={classes.more_button}>مشاهده بیشتر</button>
          </Link>
          <Image src={leftchevron} width={10} />
        </div>
      </div>
    </Layout>
  );
}
