import AppHeader from "../Layout/AppHeader";
import Image from "next/image";
import classes from "./poster.module.css";
import dynamic from "next/dynamic";
import bicycle from "../assets/images/bicycle.png";
import bic from "../assets/images/bic.webp";
import { HiOutlineBookmark, HiOutlineShare } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
let swiperInstance = null;

const NeshanMap = dynamic(
  () => import("react-neshan-map-leaflet/dist/NeshanMap"),
  {
    ssr: false,
  }
);

const Poster = () => {
  const latLong = [35.742473999999994001, 51.502310300000005001];
  const [slider, setSlider] = useState(0);
  const [slides, setSlides] = useState([bicycle, bic]);

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
              <Swiper
                slidesPerView={1}
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => {
                  setSlider(swiper.activeIndex);
                  console.log(swiper);
                }}
                onSwiper={(swiper) => {
                  swiper.activeIndex = slider;
                  swiperInstance = swiper;
                }}
                className="swiper-slide"
                width={500}
                height={360}
              >
                {slides.map((slide, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <Image
                        className={classes.slide_image}
                        src={slide}
                        width={500}
                        height={360}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className={classes.slides_container}>
                {slides.map((slide, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSlider(index);
                        swiperInstance.slideTo(index);
                      }}
                    >
                      <Image
                        className={`${classes.small_slide_image} ${
                          index === slider && classes.active
                        }`}
                        src={slide}
                        width={70}
                        height={70}
                      />
                    </div>
                  );
                })}
              </div>
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
