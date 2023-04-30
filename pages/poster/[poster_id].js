import AppHeader from "../../Layout/AppHeader";
import Image from "next/image";
import classes from "./poster.module.css";
import dynamic from "next/dynamic";
import bicycle from "../../assets/images/bicycle.png";
import bic from "../../assets/images/bic.webp";
import { HiOutlineBookmark, HiOutlineShare } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import axios from "axios";
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
  const [poster, setPoster] = useState({
    title: "",
    description: "",
    address: [],
  });
  const router = useRouter();

  const checkLatLong = () => {
    if (poster?.address.length > 0) {
      if (poster.address[0].latitude && poster.address[0].longtitude) {
        return [poster.address[0].latitude, poster.address[0].longtitude];
      } else {
        return latLong;
      }
    } else {
      return latLong;
    }
  };
  useEffect(() => {
    if (router.query.poster_id) {
      fetchPoster();
    }
  }, [router.query.poster_id]);

  const fetchPoster = async () => {
    const { data } = await axios.get(
      `https://main-backend.iran.liara.run/api/v1/posters/${router.query.poster_id}`
    );
    console.log(data);
    setPoster(data);
  };
  return (
    <>
      <AppHeader />
      <div className={classes.container}>
        <div className={classes.poster_container}>
          <div className={classes.details_container}>
            <h2>{poster.title}</h2>
            {poster?.status === "lost" ? (
              <p>
                {"3 دقیقه پیش" + " "}
                <span className={classes.lost}> گم شده </span>
                در{" "}
                <b>
                  {poster?.address.length > 0
                    ? poster.address[0].address_detail
                    : ""}
                </b>
              </p>
            ) : (
              <p>
                {"3 دقیقه پیش" + " "}
                <span className={classes.found}> پیدا شده </span>
                در{" "}
                <b>
                  {" "}
                  {poster?.address.length > 0
                    ? poster.address[0].address_detail
                    : ""}
                </b>
              </p>
            )}

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
              <h3>توضیحات</h3> {poster?.description}
            </div>
            <div className={classes.badges_container}>
              {poster?.categories?.map((cat) => {
                if (cat.name === "فوری") {
                  return (
                    <div className={`${classes.badge} ${classes.emergency}`}>
                      فوری
                    </div>
                  );
                }
                if (cat.name === "مژدگانی") {
                  return (
                    <div className={`${classes.badge} ${classes.reward}`}>
                      مژدگانی{" "}
                    </div>
                  );
                }
                return (
                  <div className={`${classes.badge} ${classes.category}`}>
                    {cat.name}
                  </div>
                );
              })}
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
                {poster?.images?.map((slide, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img
                        className={classes.slide_image}
                        src={slide.url}
                        width={500}
                        height={360}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <div className={classes.slides_container}>
                {poster?.images?.map((slide, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        setSlider(index);
                        swiperInstance.slideTo(index);
                      }}
                    >
                      <img
                        className={`${classes.small_slide_image} ${
                          index === slider && classes.active
                        }`}
                        src={slide.url}
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
              {poster.address.length > 0 && (
                <NeshanMap
                  options={{
                    key: "web.66cfce07db6049a6a227e68668211488",
                    center: checkLatLong(),
                    zoom: 15,
                  }}
                  style={{
                    width: "100%",
                    height: "270px",
                    borderRadius: "4px",
                    border: "2px solid #efefefcc",
                  }}
                  onInit={(L, myMap) => {
                    let marker = L.marker(checkLatLong())
                      .addTo(myMap)
                      .bindPopup("اینجا گم کردم");

                    myMap.on("click", function (e) {
                      marker.setLatLng(e.latlng);
                    });
                    L.circle(checkLatLong(), {
                      color: "red",
                      fillColor: "#f03",
                      fillOpacity: 0.5,
                      radius: 500,
                    }).addTo(myMap);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Poster;
