import AppHeader from "../Layout/AppHeader";
import Layout from "../Layout/Layout";
import bicycle from "../assets/images/bicycle.png";
import Poster from "../components/Poster";
import classes from "./posters.module.css";
import SmallPoster from "../components/SmallPoster";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";
import axios from "axios";
import { HiSearch } from "react-icons/hi";
import { useAuth } from "../context/AuthProvider";
const posters = [
  {
    title: "دوچرخه",
    address: [{ address_detail: "صادقیه" }],
    images: [],
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],
    description:
      "یک دوچرخه در فلان جا گم شده است ، از یابنده تقاضا میشود که با شماره ذکر شده تماس بگیرد یشتر ...",
    time_description: "3 دقیقه پیش",
    status: "found",
  },
  {
    title: "دوچرخه",
    address: ["صادقیه"],
    images: [],
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],

    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: false,
    lost: true,
  },
  {
    title: "دوچرخه",
    address: ["صادقیه"],
    images: [],
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],

    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    address: ["صادقیه"],
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],

    images: [],
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],

    address: ["صادقیه"],
    images: [],
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],
    title: "دوچرخه",
    address: ["صادقیه"],
    images: [],
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],
    address: ["صادقیه"],
    images: [],
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],
    address: ["صادقیه"],
    images: [],
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    categories: [{ name: "فوری" }, { name: "دسته کلید" }],
    title: "دوچرخه",
    address: ["صادقیه"],
    images: [],
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
];
const latLong = [35.742473999999994001, 51.502310300000005001];
const NeshanMap = dynamic(
  () => import("react-neshan-map-leaflet/dist/NeshanMap"),
  {
    ssr: false,
  }
);

const Posters = () => {
  const [type, setType] = useState("");
  const [checked, setChecked] = useState(false);
  const [allPosters, setAllPosters] = useState([]);

  const { auth, setAuth } = useAuth();
  console.log(auth);
  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
  };
  const fetchPosters = async () => {
    try {
      const { data } = await axios.get(
        "https://main-backend.iran.liara.run/api/v1/posters/?page_id=1&page_size=10&sort=asc&sort_by=created_at&status=both"
      );
      console.log(data);
      setAllPosters(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchPosters();
  }, []);
  return (
    <>
      <AppHeader />
      {/* <div className={classes.sidebar}>سایدبار</div> */}
      <div className={classes.container}>
        <div className={classes.filter_container}>
          <NeshanMap
            options={{
              key: "web.66cfce07db6049a6a227e68668211488",
              center: latLong,
              zoom: 13,
            }}
            style={{
              width: "60%",
              height: "300px",
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
          <div className={classes.filter_options_container}>
            <div className={classes.searchbar_container}>
              <input placeholder="چی گم کردی ؟ مثلا دسته کلید ..." />
              <HiSearch
                width={24}
                style={{ position: "absolute", left: "75px", top: "12px" }}
                color="rgba(0, 0, 0, 0.3)"
              />
            </div>
            <div className={classes.found_lost_container}>
              <div
                className={`${classes.found_lost_item} ${
                  type === "گمشده" ? classes.active : ""
                }`}
                onClick={() => {
                  setType("گمشده");
                }}
              >
                گمشده
              </div>
              <div
                className={`${classes.found_lost_item} ${
                  type === "پیدا شده" ? classes.active : ""
                }`}
                onClick={() => {
                  setType("پیدا شده");
                }}
              >
                پیدا شده
              </div>
            </div>
            <div className={classes.reward_container}>
              {" "}
              مژدگانی
              <ReactSwitch
                onChange={handleChange}
                checked={checked}
                onColor="#cdf0ea"
                color="#88888824"
                offColor="#e8e8e8"
                // onHandleColor="rgb(130 210 197)"
                handleDiameter={20}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
              />
            </div>
            <button className={classes.filter_button}>بگرد</button>
          </div>
        </div>
        <div className={classes.posters_container}>
          {allPosters.map((poster, index) => (
            <SmallPoster
              key={index}
              image={
                poster?.images.length > 0 ? poster?.images[0]?.url : bicycle
              }
              title={poster.title}
              location={poster.address[0].address_detail}
              description={poster.description}
              categories={poster.categories}
              // time_description={poster.time_description}
              found={poster.status === "found"}
              lost={poster.status === "lost"}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Posters;
