import axios from "axios";
import classes from "./ReportPopup.module.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
const ReportPopup = ({ setShow, posterId }) => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className={classes.container}>
      <div className={classes.body}>
        <div className={classes.title}>گزارش آگهی</div>
        <div className={classes.input_text}>متن گزارش</div>
        <textarea
          className={classes.report_input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className={classes.buttons_container}>
          <button
            className={classes.button_cancel}
            onClick={() => setShow(false)}
          >
            بستن
          </button>
          <button
            className={classes.button}
            onClick={async () => {
              setLoading(true);
              const data = await axios.post(
                `https://main-backend.iran.liara.run/api/v1/reports/report-poster?poster_id=${posterId}&issuer_id=1&report_type=other&description=${description}`
              );
              console.log(data);
              toast.success("گزارش شما با موفقیت ثبت شد");
              setShow(false);
            }}
          >
            {loading ? (
              <Oval
                height={20}
                width={20}
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
              "ارسال گزارش"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
