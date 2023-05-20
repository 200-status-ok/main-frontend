import classes from "./my-wallet.module.css";
import AppHeader from "../Layout/AppHeader";
import { useState } from "react";
import TransactionItem from "../components/TransactionItem";
import axios from "axios";
const depositOptions = ["50000", "100000", "200000", "500000"];
const MyWallet = () => {
  const [depositAmount, setDepositAmount] = useState("");

  return (
    <>
      <AppHeader></AppHeader>
      <div className={classes.container}>
        <div className={classes.balance_container}>
          موجودی کیف پول : 270000 ریال
        </div>
        <div className={classes.deposit_container}>
          <span className={classes.currency}>ریال</span>
          <input
            className={classes.deposit_input}
            placeholder="مبلغ مورد نظر را وارد کنید"
            value={depositAmount}
            onChange={(e) => {
              setDepositAmount(e.target.value);
            }}
          />
          <button
            className={classes.deposit_button}
            onClick={async () => {
              if (depositAmount > 0) {
                const response = await axios.get(
                  `https://main-backend.iran.liara.run/api/v1/users/authorize/payment/user_wallet?url=http://localhost:3000/payment&amount=${depositAmount}`
                );
                console.log(response);
              }
            }}
          >
            افزایش موجودی
          </button>
        </div>
        <div className={classes.deposit_options_container}>
          {depositOptions.map((d) => (
            <div
              className={classes.desposit_options_item}
              onClick={() => {
                setDepositAmount(d);
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div className={classes.transactions_container}>
          <div className={classes.transaction_header}>تراکنش های من</div>
          <div className={classes.transactions_list}>
            <div className={classes.transaction_list_header}>
              <div className={classes.transaction_list_header_item}>تاریخ</div>
              <div className={classes.transaction_list_header_item}>مبلغ</div>
              <div className={classes.transaction_list_header_item}>وضعیت</div>
            </div>
            <div className={classes.transaction_list_body}>
              <TransactionItem
                amount="30000"
                date="1402/02/30"
                state="ناموفق"
              />
              <TransactionItem amount="30000" date="1402/02/30" state="موفق" />
              <TransactionItem amount="30000" date="1402/02/30" state="موفق" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyWallet;
