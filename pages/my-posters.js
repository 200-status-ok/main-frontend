import { useState, useEffect } from "react";
import AppHeader from "../Layout/AppHeader";
import classes from "./posters.module.css";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import SmallPoster from "../components/SmallPoster";
import bicycle from "../assets/images/bicycle.png";

const MyPosters = () => {
  const [allPosters, setAllPosters] = useState();
  const { auth, setAuth } = useAuth();
  const fetchPosters = async () => {
    try {
      const { data } = await axios.get(
        `https://main-backend.iran.liara.run/api/v1/users/authorize/`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      setAllPosters(data.posters);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchPosters();
    }
  }, [auth]);
  return (
    <>
      <AppHeader />
      <div className={classes.posters_container}>
        {!allPosters && (
          <div
            style={{
              marginTop: "100px",
              fontSize: "24px",
              textAlign: "center",
            }}
          >
            بدون آگهی
          </div>
        )}
        {allPosters &&
          allPosters.map((poster, index) => (
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
              // time_description={poster.time_description}
              found={poster.status === "found"}
              lost={poster.status === "lost"}
              award={poster?.award}
            />
          ))}
      </div>
    </>
  );
};

export default MyPosters;
