import { useState } from "react";
import classes from "./AppHeader.module.css";
import {
  HiOutlineLocationMarker,
  HiPlus,
  HiOutlineViewGrid,
  HiOutlineChatAlt2,
} from "react-icons/hi";
const states = [
  {
    name: "آذربايجان شرقی",
    center: "تبریز",
    latitude: "38.50",
    longitude: "46.180",
    id: 1,
  },
  {
    name: "آذربايجان غربی",
    center: "ارومیه",
    latitude: "37.320",
    longitude: "45.40",
    id: 2,
  },
  {
    name: "اردبيل",
    center: "اردبیل",
    latitude: "38.140",
    longitude: "48.170",
    id: 3,
  },
  {
    name: "اصفهان",
    center: "اصفهان",
    latitude: "32.390",
    longitude: "51.400",
    id: 4,
  },
  {
    name: "ايلام",
    center: "ايلام",
    latitude: "33.380",
    longitude: "46.250",
    id: 5,
  },
  {
    name: "بوشهر",
    center: "بوشهر",
    latitude: "28.590",
    longitude: "50.500",
    id: 6,
  },
  {
    name: "تهران",
    center: "تهران",
    latitude: "35.410",
    longitude: "51.240",
    id: 7,
  },
  {
    name: "چهارمحال بختیاری",
    center: "شهركرد",
    latitude: "32.190",
    longitude: "50.510",
    id: 8,
  },
  {
    name: "خراسان جنوبی",
    center: "بيرجند",
    latitude: "32.5216",
    longitude: "59.1315",
    id: 9,
  },
  {
    name: "خراسان رضوی",
    center: "مشهد",
    latitude: "36.170",
    longitude: "59.350",
    id: 10,
  },
  {
    name: "خراسان شمالی",
    center: "بجنورد",
    latitude: "37.2835",
    longitude: "57.1954",
    id: 11,
  },
  {
    name: "خوزستان",
    center: "اهواز",
    latitude: "31.190",
    longitude: "48.410",
    id: 12,
  },
  {
    name: "زنجان",
    center: "زنجان",
    latitude: "36.400",
    longitude: "48.290",
    id: 13,
  },
  {
    name: "سمنان",
    center: "سمنان",
    latitude: "35.340",
    longitude: "53.230",
    id: 14,
  },
  {
    name: "سيستان و بلوچستان",
    center: "زاهدان",
    latitude: "29.320",
    longitude: "60.540",
    id: 15,
  },
  {
    name: "فارس",
    center: "شيراز",
    latitude: "29.360",
    longitude: "52.310",
    id: 16,
  },
  {
    name: "قزوين",
    center: "قزوين",
    latitude: "36.167",
    longitude: "50.010",
    id: 17,
  },
  { name: "قم", center: "قم", latitude: "34.380", longitude: "50.530", id: 18 },
  {
    name: "البرز",
    center: "کرج",
    latitude: "35.8400",
    longitude: "50.9391",
    id: 19,
  },
  {
    name: "كردستان",
    center: "سنندج",
    latitude: "35.180",
    longitude: "47.10",
    id: 20,
  },
  {
    name: "کرمان",
    center: "کرمان",
    latitude: "30.160",
    longitude: "57.40",
    id: 21,
  },
  {
    name: "كرمانشاه",
    center: "كرمانشاه",
    latitude: "34.180",
    longitude: "47.30",
    id: 22,
  },
  {
    name: "كهكيلويه و بويراحمد",
    center: "ياسوج",
    latitude: "30.390",
    longitude: "51.350",
    id: 23,
  },
  {
    name: "گلستان",
    center: "گرگان",
    latitude: "36.500",
    longitude: "54.250",
    id: 24,
  },
  {
    name: "گيلان",
    center: "رشت",
    latitude: "37.160",
    longitude: "49.350",
    id: 25,
  },
  {
    name: "لرستان",
    center: "خرم آباد",
    latitude: "33.290",
    longitude: "48.210",
    id: 26,
  },
  {
    name: "مازندران",
    center: "ساري",
    latitude: "36.330",
    longitude: "53.30",
    id: 27,
  },
  {
    name: "مرکزی",
    center: "اراک",
    latitude: "34.50",
    longitude: "49.410",
    id: 28,
  },
  {
    name: "هرمزگان",
    center: "بندرعباس",
    latitude: "56.266",
    longitude: "27.18",
    id: 29,
  },
  {
    name: "همدان",
    center: "همدان",
    latitude: "34.470",
    longitude: "48.300",
    id: 30,
  },
  {
    name: "يزد",
    center: "يزد",
    latitude: "31.530",
    longitude: "54.210",
    id: 31,
  },
];
const AppHeader = () => {
  const [city, setCity] = useState("تهران");
  const [showCities, setShowCities] = useState(false);
  return (
    <div className={classes.header}>
      <div className={classes.header_layout}>
        <div
          className={`${classes.all_cities_container} ${
            showCities ? classes.active : ""
          }`}
        >
          {states.map((s) => (
            <div
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
          <h1 className={classes.header_logo}>همینجاست</h1>
          <hr className={classes.divider} />
          <div
            className={classes.city_container}
            onClick={() => {
              setShowCities(!showCities);
            }}
          >
            <HiOutlineLocationMarker width={10} color="rgba(0, 0, 0, 0.56)" />
            {city}
          </div>
        </div>
        <div className={classes.header_left}>
          <div className={classes.header_menu_items}>
            <HiOutlineViewGrid width={10} color="rgba(0, 0, 0, 0.56)" />
            آگهی های من
          </div>
          <div className={classes.header_menu_items}>
            <HiOutlineChatAlt2 width={10} color="rgba(0, 0, 0, 0.56)" />
            چت
          </div>
          <div className={classes.add_poster_btn}>
            ثبت آگهی
            <HiPlus width={10} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
