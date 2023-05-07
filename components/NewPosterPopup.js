import classes from "./NewPosterPopup.module.css";
import PosterClasses from "../pages/posters.module.css";
import SearchableSelect from "./SearchableSelect";
import { useEffect, useRef, useState } from "react";
import { states } from "../data/province/Province";
import Tehran from "../data/districts/Tehran.json";
import box from "../assets/images/box.svg";
import SearchableSelectTags from "./SearchableSelectTags";
const MapWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import {
  HiOutlinePhotograph,
  HiOutlinePlus,
  HiPlusCircle,
  HiTrash,
} from "react-icons/hi";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
const NewPosterPopup = () => {
  const [province, setProvince] = useState(states[6]);
  const [district, setDistrict] = useState(Tehran.districts[0]);
  const [latLong, setLatLong] = useState();

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

  const { auth, setAuth } = useAuth();
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
      const { data } = await axios.get(
        "https://main-backend.iran.liara.run/api/v1/tags/"
      );
      setAllTags(data);
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
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.title_container}>
          <div className={classes.title}>عنوان آگهی</div>
          <input
            className={classes.input}
            value={poster.title}
            onChange={(e) => {
              setPoster({ ...poster, title: e.target.value });
            }}
          />
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
          <MapWithNoSSR
            lat={district.centroid.latitude}
            lng={district.centroid.longitude}
            nocircle
            setLatLong={setLatLong}
          />
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
              const { data } = await axios.post(
                "https://main-backend.iran.liara.run/api/v1/posters/",
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
                    award: 0,
                    chat: true,
                    description: poster.description,
                    status: poster.status,
                    tel_id: "mhr1380",
                    title: poster.title,
                    user_id: 1,
                    user_phone: "09030335008",
                  },
                  tags: [...tags.map((tag) => tag.id)],
                }
              );
              setAuth({ ...auth, showNewPosterPopup: false, refresh: true });
              console.log(data);
            }}
          >
            ثبت
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPosterPopup;
