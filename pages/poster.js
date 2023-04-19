import AppHeader from "../Layout/AppHeader";
import Image from "next/image";
import classes from "./poster.module.css";
import dynamic from "next/dynamic";
import bicycle from "../assets/images/bicycle.png";
import bic from "../assets/images/bic.webp";
import { HiOutlineBookmark, HiOutlineShare } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
const Poster = () => {
  const latLong = [35.742473999999994001, 51.502310300000005001];
  const NeshanMap = dynamic(
    () => import("react-neshan-map-leaflet/dist/NeshanMap"),
    {
      ssr: false,
    }
  );
  return (
    <>
      <AppHeader />
      <div className={classes.container}>
        <div className={classes.poster_container}>
          <div className={classes.details_container}>
            <h2>دوچرخه قرمز گمشده در صادقیه تهران</h2>
            <p>
              {"3 دقیقه پیش" + " "}
              <span className={classes.lost}> گم شده </span>
              در <b>{"صادقیه"}</b>
            </p>

            <div className={classes.poster_cta_container}>
              <div className={classes.poster_cta_buttons}>
                <button className={classes.contact}>اطلاعات تماس</button>
                <button className={classes.chat}>چت</button>
              </div>

              <div className={classes.poster_cta_share}>
                <div className={classes.share_button}>
                  <HiOutlineBookmark size="20px" />
                </div>
                <div className={classes.share_button}>
                  <HiOutlineShare size="20px" />
                </div>
              </div>
            </div>
            <div className={classes.poster_description}>
              <h3>توضیحات</h3> یک دوچرخه در فلان جا گم شده است ، از یابنده تقاضا
              میشود که با شماره ذکر شده تماس بگیرد لورم ایپسوم متن ساختگی با
              تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک
              است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان پایان.
            </div>
            <div className={classes.badges_container}>
              <div className={`${classes.badge} ${classes.emergency}`}>
                فوری
              </div>
              <div className={`${classes.badge} ${classes.category}`}>
                دسته کلید
              </div>
              <div className={`${classes.badge} ${classes.reward}`}>
                مژدگانی
              </div>
            </div>
          </div>
          <div className={classes.media_container}>
            <div className={classes.slider_container}>
              <Image src={bicycle} width={430} height={360} />
              {/* <Swiper
                slidesPerView={1}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
                className="swiper-slide"
                width={430}
                height={360}
              >
                <SwiperSlide>
                  <Image src={bicycle} />
                </SwiperSlide>
                <SwiperSlide>
                  <Image src={bic} />
                </SwiperSlide>
              </Swiper> */}
            </div>
            <div className={classes.map_container}>
              موقعیت
              <NeshanMap
                options={{
                  key: "web.66cfce07db6049a6a227e68668211488",
                  center: latLong,
                  zoom: 13,
                }}
                style={{
                  width: "100%",
                  height: "270px",
                  borderRadius: "4px",
                  border: "2px solid #efefefcc",
                }}
                onInit={(L, myMap) => {
                  let marker = L.marker(latLong)
                    .addTo(myMap)
                    .bindPopup("اینجا گم کردم");

                  myMap.on("click", function (e) {
                    marker.setLatLng(e.latlng);
                  });
                  L.circle(latLong, {
                    color: "red",
                    fillColor: "#f03",
                    fillOpacity: 0.5,
                    radius: 500,
                  }).addTo(myMap);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Poster;
