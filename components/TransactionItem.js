import classes from "../pages/my-wallet.module.css";
const TransactionItem = ({ date, amount, state }) => {
  return (
    <div className={classes.transaction_item}>
      <div className={classes.transaction_subitem}>{date}</div>
      <div className={classes.transaction_subitem}>{amount}</div>
      <div
        className={`${state === "موفق" ? classes.success : classes.failed} ${
          classes.transaction_subitem
        }`}
      >
        {state}
      </div>
    </div>
  );
};

export default TransactionItem;
