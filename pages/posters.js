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
import { useRouter } from "next/router";
import NewPosterPopup from "../components/NewPosterPopup";
import SearchableSelectTags from "../components/SearchableSelectTags";
import { toast } from "react-toastify";

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
const MapWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});
const checkLatLong = (latLong) => {
  if (latLong == 35.686023 || latLong == 51.393045) {
    return "";
  }
  return latLong;
};
const Posters = () => {
  const [type, setType] = useState("both");
  const [checked, setChecked] = useState(false);
  const [allPosters, setAllPosters] = useState([]);

  const router = useRouter();
  console.log(router.query);
  const [error, setError] = useState("");
  const [latLong, setLatLong] = useState({ lat: 35.686023, lng: 51.393045 });

  const [search, setSearch] = useState("");

  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const [refetch, setRefetch] = useState(0);
  const { auth, setAuth } = useAuth();

  const [drawCircle, setDrawCircle] = useState(false);

  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
  };
  const fetchPosters = async () => {
    try {
      const { data } = await axios.get(
        `https://main-backend.iran.liara.run/api/v1/posters/?page_id=1&page_size=10&state=accepted&status=${type}${
          tags.length > 0 ? `&tags=${tags.map((t) => t.id).toString()}` : ""
        }&only_rewards=${checked}&search_phrase=${
          search ? search : ""
        }&lat=${checkLatLong(latLong.lat)}&lon=${checkLatLong(latLong.lng)}`
      );
      setError("");
      setAllPosters(data);
    } catch (error) {
      console.log(error);
      // setError("خطایی در دریافت اطلاعات پیش آمده است ...");
    }
  };
  const fetchTags = async () => {
    try {
      const { data } = await axios.get(
        "https://main-backend.iran.liara.run/api/v1/tags/"
      );
      setAllTags(data);
    } catch (error) {
      toast.error("خطایی در دریافت دسته بندی ها رخ داده است");
    }
  };
  useEffect(() => {
    fetchPosters();
    if (tags.length === 0) {
      fetchTags();
    }
  }, [refetch]);
  useEffect(() => {
    if (router.query) {
      setSearch(router.query.search);
      const timer = setTimeout(() => {
        setRefetch(refetch + 1);
        clearTimeout(timer);
      }, 1000);
    }
  }, [router.query]);

  // useEffect(() => {
  //   (async () => {
  //     const { data } = await axios.get(
  //       `https://main-backend.iran.liara.run/api/v1/tags/`
  //     );
  //     const filteredTags = data.filter((tag) => tag.name.includes(tagInput));
  //     setAllTags(filteredTags);
  //   })();
  // }, [tagInput]);
  return (
    <>
      <AppHeader />
      {/* <div className={classes.sidebar}>سایدبار</div> */}
      <div className={classes.container}>
        <div className={classes.filter_container}>
          <MapWithNoSSR
            style={{ width: "60%", height: "330px" }}
            zoom={11.5}
            radius={1500}
            setLatLong={setLatLong}
            latLong={latLong}
            firstCircle={false}
          />
          <div className={classes.filter_options_container}>
            <div className={classes.searchbar_container}>
              <input
                placeholder="چی گم کردی ؟ مثلا دسته کلید ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <HiSearch
                width={24}
                style={{ position: "absolute", left: "75px", top: "12px" }}
                color="rgba(0, 0, 0, 0.3)"
              />
            </div>
            <div className={classes.search_tags_container}>
              <SearchableSelectTags
                options={allTags}
                setAllTags={setAllTags}
                allTags={allTags}
                tags={tags}
                setTags={setTags}
                zindex={10000}
                placeholder="دسته بندی ها"
                customStyle={{ border: "1px solid rgba(0,0,0,.16)" }}
                maxLengthOfTags={"240px"}
              />
            </div>
            {/* <div className={classes.searchbar_container_new}>
              <input
                placeholder="چی گم کردی ؟ مثلا دسته کلید ..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              {allTags.length > 0 && (
                <div className={classes.tags_container}>
                  {allTags.map((tag) => (
                    <div className={classes.tag}>{tag.name}</div>
                  ))}
                </div>
              )}
              <HiSearch
                width={24}
                style={{ position: "absolute", left: "75px", top: "12px" }}
                color="rgba(0, 0, 0, 0.3)"
              />
            </div> */}
            <div className={classes.found_lost_container}>
              <div
                className={`${classes.found_lost_item} ${
                  type === "both" ? classes.active : ""
                }`}
                onClick={() => {
                  setType("both");
                }}
              >
                هردو
              </div>
              <div
                className={`${classes.found_lost_item} ${
                  type === "lost" ? classes.active : ""
                }`}
                onClick={() => {
                  setType("lost");
                }}
              >
                گمشده
              </div>
              <div
                className={`${classes.found_lost_item} ${
                  type === "found" ? classes.active : ""
                }`}
                onClick={() => {
                  setType("found");
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

            <button
              className={classes.filter_button}
              onClick={() => setRefetch(refetch + 1)}
            >
              بگرد
            </button>
          </div>
        </div>
        {error && <div className={classes.error}>{error}</div>}

        <div className={classes.posters_container}>
          {console.log(allPosters)}
          {allPosters.map((poster, index) => (
            <SmallPoster
              id={poster.id}
              key={index}
              image={
                poster?.images.length > 0 ? poster?.images[0]?.url : bicycle.src
              }
              title={poster.title}
              location={poster.address[0].address_detail}
              description={poster.description}
              categories={poster.categories}
              special_type={poster.special_type}
              // time_description={poster.time_description}
              found={poster.status === "found"}
              lost={poster.status === "lost"}
              award={poster?.award}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Posters;
