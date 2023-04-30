import classes from "../pages/posters.module.css";
import Image from "next/image";
const lengthOfDescription = 80;
const SmallPoster = ({
  image,
  title,
  description,
  found,
  lost,
  location,
  time_description,
  categories,
}) => {
  return (
    <div className={classes.poster}>
      <div className={classes.poster_body}>
        <div className={classes.poster_title}>{title}</div>
        <div className={classes.poster_description}>
          {description.length > lengthOfDescription
            ? description.slice(0, lengthOfDescription) + " ..."
            : description}
        </div>

        <div className={classes.badges_container}>
          {categories?.map((cat) => {
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
        {found && (
          <p className={classes.time_description}>
            {time_description}
            <span className={classes.found}> پیدا شده </span>
            در <b>{location}</b>
          </p>
        )}
        {lost && (
          <p className={classes.time_description}>
            {time_description}
            <span className={classes.lost}> گم شده </span>
            در <b>{location}</b>
          </p>
        )}
      </div>
      <img
        className={classes.poster_image}
        src={image}
        width={150}
        height={150}
      />
    </div>
  );
};

export default SmallPoster;
