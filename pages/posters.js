import AppHeader from "../Layout/AppHeader";
import Layout from "../Layout/Layout";
import bicycle from "../assets/images/bicycle.png";
import Poster from "../components/Poster";
import classes from "./posters.module.css";
import SmallPoster from "../components/SmallPoster";
const posters = [
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دوچرخه در فلان جا گم شده است ، از یابنده تقاضا میشود که با شماره ذکر شده تماس بگیرد یشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
  {
    title: "دوچرخه",
    location: "صادقیه",
    image: bicycle,
    description:
      "یک دسته کلید در فلان جا گم شده است ، از یابنده تقاضا میشود که بفرستد برای ما سلام چطوری میخاومبشه 4 خط و بیشتر ...",
    time_description: "3 دقیقه پیش",
    found: true,
    lost: false,
  },
];
const Posters = () => {
  return (
    <>
      <AppHeader />
      <div className={classes.sidebar}>سایدبار</div>
      <div className={classes.container}>
        <div className={classes.posters_container}>
          {posters.map((poster, index) => (
            <SmallPoster
              key={index}
              image={poster.image}
              title={poster.title}
              location={poster.location}
              description={poster.description}
              time_description={poster.time_description}
              found={poster.found}
              lost={poster.lost}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Posters;
