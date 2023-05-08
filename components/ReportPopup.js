import classes from "./ReportPopup.module.css";
const ReportPopup = ({ setShow }) => {
  return (
    <div className={classes.container}>
      <div className={classes.body}>
        <div className={classes.title}>گزارش آگهی</div>
        <div className={classes.input_text}>متن گزارش</div>
        <textarea className={classes.report_input}></textarea>
        <div className={classes.buttons_container}>
          <button
            className={classes.button_cancel}
            onClick={() => setShow(false)}
          >
            بستن
          </button>
          <button className={classes.button}>ارسال گزارش</button>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
