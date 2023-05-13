import classes from "./NewPosterPopup.module.css";
import PosterClasses from "../pages/posters.module.css";
import SearchableSelect from "./SearchableSelect";
import { useEffect, useRef, useState } from "react";
import { states } from "../data/province/Province";
import { BsMagic } from "react-icons/bs";
import { RxMagicWand } from "react-icons/rx";
import Tehran from "../data/districts/Tehran.json";
import box from "../assets/images/box.svg";
import SearchableSelectTags from "./SearchableSelectTags";
const MapWithNoSsrNewPoster = dynamic(
  () => import("../components/NewPosterMap"),
  {
    ssr: false,
  }
);
import dynamic from "next/dynamic";
import {
  HiOutlinePhotograph,
  HiOutlinePlus,
  HiPlusCircle,
  HiTrash,
} from "react-icons/hi";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import ReactSwitch from "react-switch";
const NewPosterPopup = () => {
  const [province, setProvince] = useState(states[6]);
  const [district, setDistrict] = useState(Tehran.districts[0]);
  const [latLong, setLatLong] = useState({
    lat: district.centroid.latitude,
    lng: district.centroid.longitude,
  });
  const [sendLoading, setSendLoading] = useState(false);

  const [award, setAward] = useState(false);

  const [aiObjects, setAiObjects] = useState();

  const [allTags, setAllTags] = useState([]);

  const [poster, setPoster] = useState({
    title: "",
    description: "",
    status: "lost",
  });
  const [tags, setTags] = useState([]);
  const [imagesToBackend, setImagesToBackend] = useState([]);
  const [images, setImages] = useState([]);
  const imageRef = useRef();

  const [loadingAi, setLoadingAi] = useState(false);

  const { auth, setAuth } = useAuth();

  useEffect(() => {
    console.log("district", district);
    setLatLong({
      lat: district.centroid.latitude,
      lng: district.centroid.longitude,
    });
  }, [district]);
  useEffect(() => {
    (async () => {
      if (images.length > 0) {
        images.forEach(async (image) => {
          console.log(image);
          if (image.isUploaded) return;
          const formData = new FormData();
          formData.append("poster_image", image.file);
          const { data } = await axios.post(
            "https://main-backend.iran.liara.run/api/v1/posters/upload-image",
            formData
          );
          setImagesToBackend([...imagesToBackend, data.url]);
          const updatedImages = [...images];
          updatedImages[
            updatedImages.findIndex((img) => img.file === image.file)
          ].isUploaded = true;
          setImages(updatedImages);
          console.log(data);
        });
      }
    })();
  }, [images]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://main-backend.iran.liara.run/api/v1/tags/"
        );
        setAllTags(data);
      } catch (error) {
        toast.error("خطایی در دریافت دسته بندی رخ داده است");
      }
    })();
  }, []);
  const { districts } = Tehran;
  return (
    <div className={classes.container}>
      <div className={classes.body}>
        <h2 className={classes.header}>ثبت آگهی</h2>
        <div className={classes.image_container}>
          <div className={classes.image_title}>تصویر آگهی</div>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) =>
              setImages([
                ...images,
                { file: e.target.files[0], isUploaded: false },
              ])
            }
            ref={imageRef}
          />
          <div className={classes.images_container}>
            <div
              className={classes.add_image}
              onClick={() => imageRef.current.click()}
            >
              <img src={box.src} />
              <div className={classes.add_image_icon_container}>
                <HiOutlinePhotograph size={30} color="rgba(0,0,0,.48)" />
                <div className={classes.add_image_add_icon}>
                  <HiPlusCircle size={20} color="#2f89fc" />
                </div>
              </div>
            </div>
            {images.map((image) => (
              <div className={classes.image}>
                <img src={URL.createObjectURL(image.file)} />
                <div className={classes.delete_image}>
                  <HiTrash
                    size={20}
                    color="#2f89fc"
                    onClick={() => {
                      setImages(
                        images.filter((img) => img.file !== image.file)
                      );
                      // setImagesToBackend(
                      //   imagesToBackend.filter((img) => img !== image.file)
                      // );
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.title_container}>
          <div className={classes.title}>عنوان آگهی</div>
          <div className={classes.ai_button_container}>
            <input
              className={classes.title_input}
              value={poster.title}
              onChange={(e) => {
                setPoster({ ...poster, title: e.target.value });
              }}
            />
            <button
              className={`${classes.ai_generate_button} ${
                imagesToBackend[0] ? classes.active : ""
              }`}
              onClick={async () => {
                setLoadingAi(true);
                const { data } = await axios.get(
                  `https://main-backend.iran.liara.run/api/v1/api-call/generatePosterInfo?image_url=${imagesToBackend[0]}`
                );
                setAiObjects(data);
                setLoadingAi(false);
              }}
            >
              {loadingAi ? (
                <Oval
                  height={24}
                  width={24}
                  color="white"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#2f89fc"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              ) : (
                <>
                  بهوش <BsMagic />
                </>
              )}
            </button>
          </div>
          <div
            className={`${classes.title_ai_container} ${
              aiObjects && classes.show
            }`}
            style={{
              height: aiObjects
                ? aiObjects.titles.length === 0
                  ? "0px"
                  : "100px"
                : "0px",
              padding: aiObjects
                ? aiObjects.titles.length === 0
                  ? "0px"
                  : "10px"
                : "0px",
              border: aiObjects
                ? aiObjects.titles.length === 0
                  ? "0px"
                  : "1px solid rgba(0,0,0,.3)"
                : "0px",
            }}
          >
            {aiObjects &&
              aiObjects?.titles?.map((title) => (
                <div
                  className={classes.title_ai_item}
                  onClick={() => {
                    setPoster({ ...poster, title });
                    setAiObjects({
                      ...aiObjects,
                      titles: aiObjects.titles.filter((t) => t !== title),
                    });
                  }}
                >
                  {title}
                </div>
              ))}
          </div>
        </div>
        <div className={classes.description_container}>
          <div className={classes.description}>توضیحات</div>
          <textarea
            className={classes.textarea}
            value={poster.description}
            onChange={(e) =>
              setPoster({ ...poster, description: e.target.value })
            }
          />
          <div
            className={`${classes.title_ai_container} ${
              aiObjects && classes.show
            }`}
            style={{
              height: aiObjects ? (!aiObjects.description ? 0 : 100) : 0,
              padding: aiObjects ? (!aiObjects.description ? 0 : 8) : 0,
              border: aiObjects
                ? !aiObjects.description
                  ? 0
                  : "1px solid rgba(0,0,0,.3)"
                : 0,
            }}
          >
            {aiObjects && (
              <div
                className={classes.title_ai_item}
                onClick={() => {
                  setPoster({ ...poster, description: aiObjects.description });
                  setAiObjects({ ...aiObjects, description: "" });
                }}
              >
                {aiObjects?.description}
              </div>
            )}
          </div>
        </div>

        <div className={classes.tags_container}>
          <div className={classes.tags}>برچسب ها</div>
          <SearchableSelectTags
            options={allTags}
            setAllTags={setAllTags}
            allTags={allTags}
            tags={tags}
            setTags={setTags}
            zindex={10000000}
          />
          <div
            className={`${classes.title_ai_container} ${
              aiObjects && classes.show
            }`}
            style={{
              height: aiObjects
                ? aiObjects.tags.length === 0
                  ? "0px"
                  : "100px"
                : "0px",
              padding: aiObjects
                ? aiObjects.tags.length === 0
                  ? "0px"
                  : "10px"
                : "0px",
              border: aiObjects
                ? aiObjects.tags.length === 0
                  ? "0px"
                  : "1px solid rgba(0,0,0,.3)"
                : "0px",
            }}
          >
            {aiObjects &&
              aiObjects?.tags?.map((tag) => (
                <div
                  className={classes.title_ai_item}
                  onClick={() => {
                    setTags([...tags, { name: tag, id: -1 }]);
                    setAiObjects({
                      ...aiObjects,
                      tags: aiObjects.tags.filter((t) => t !== tag),
                    });
                  }}
                >
                  {tag}
                </div>
              ))}
          </div>
        </div>
        <div
          className={PosterClasses.found_lost_container}
          style={{ justifyContent: "center", width: "100%" }}
        >
          <div
            className={`${PosterClasses.found_lost_item} ${
              poster.status === "lost" ? PosterClasses.active : ""
            }`}
            onClick={() => {
              setPoster({ ...poster, status: "lost" });
            }}
            style={{ width: "50%", textAlign: "center", padding: "8px" }}
          >
            گمشده
          </div>
          <div
            className={`${PosterClasses.found_lost_item} ${
              poster.status === "found" ? PosterClasses.active : ""
            }`}
            onClick={() => {
              setPoster({ ...poster, status: "found" });
            }}
            style={{ width: "50%", textAlign: "center", padding: "8px" }}
          >
            پیدا شده
          </div>
        </div>
        <div className={classes.award_container}>
          {" "}
          مژدگانی
          <ReactSwitch
            onChange={(e) => setAward(e)}
            checked={award}
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
        <div className={classes.province_container}>
          <div className={classes.province}>استان</div>
          <SearchableSelect
            options={states}
            value={province}
            setValue={setProvince}
            zindex="1000000"
          />
        </div>

        <div className={classes.province_container}>
          <div className={classes.province}>محله</div>
          <SearchableSelect
            options={districts}
            value={district}
            setValue={setDistrict}
          />
        </div>
        <div className={classes.map}>
          <MapWithNoSsrNewPoster latLong={latLong} setLatLong={setLatLong} />
        </div>
        <div className={classes.buttons_container}>
          <div
            className={classes.cancel_button}
            onClick={() => {
              setAuth({ ...auth, showNewPosterPopup: false });
            }}
          >
            لغو
          </div>
          <div
            className={classes.submit_button}
            onClick={async () => {
              if (!poster.title || !poster.description) {
                toast.error("لطفا تمامی فیلد ها را پر کنید");
              } else {
                setSendLoading(true);
                await axios.post(
                  "https://main-backend.iran.liara.run/api/v1/posters/authorize/",
                  {
                    addresses: [
                      {
                        address_detail: district.name,
                        city: province.name,
                        latitude: latLong.lat,
                        longitude: latLong.lng,
                        province: province.name,
                      },
                    ],
                    img_urls: imagesToBackend,
                    poster: {
                      alert: true,
                      award: award ? 1 : 0,
                      chat: true,
                      description: poster.description,
                      status: poster.status,
                      tel_id: "mhr1380",
                      title: poster.title,
                      user_id: 4,
                      user_phone: "09030335008",
                    },
                    state: "pending",
                    tags: [
                      ...tags.map((tag) => {
                        if (tag.id > 0) {
                          return tag.id;
                        }
                      }),
                    ].filter((tag) => tag !== undefined),
                  },
                  { headers: { Authorization: `Bearer ${auth.token}` } }
                );
                setAuth({ ...auth, showNewPosterPopup: false, refresh: true });
                setSendLoading(false);
                toast.success(
                  "آگهی شما با موفقیت ارسال شد و پس از تایید نمایش داده خواهد شد"
                );
              }
            }}
          >
            {sendLoading ? (
              <Oval
                height={24}
                width={24}
                color="white"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#2f89fc"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            ) : (
              "ثبت"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPosterPopup;
