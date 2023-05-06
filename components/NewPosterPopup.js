import classes from "./NewPosterPopup.module.css";
import SearchableSelect from "./SearchableSelect";
import { useState } from "react";
import { states } from "../data/province/Province";
import Tehran from "../data/districts/Tehran.json";
const MapWithNoSSR = dynamic(() => import("../components/Map"), {
  ssr: false,
});
import dynamic from "next/dynamic";
const NewPosterPopup = () => {
  const [province, setProvince] = useState(states[6]);
  const [district, setDistrict] = useState(Tehran.districts[0]);
  const [latLong, setLatLong] = useState();
  const { districts } = Tehran;
  return (
    <div className={classes.container}>
      <div className={classes.body}>
        <h2 className={classes.header}>ثبت آگهی</h2>
        <div className={classes.title_container}>
          <div className={classes.title}>عنوان آگهی</div>
          <input className={classes.input} />
        </div>
        <div className={classes.description_container}>
          <div className={classes.description}>توضیحات</div>
          <textarea className={classes.textarea} />
        </div>
        <div className={classes.province_container}>
          <div className={classes.province}>استان</div>
          <SearchableSelect
            options={states}
            value={province}
            setValue={setProvince}
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
      </div>
    </div>
  );
};

export default NewPosterPopup;
