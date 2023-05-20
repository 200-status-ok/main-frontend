import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Payment = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (router.query.trackId) {
        const { trackId } = router.query;
        const response = await axios.get(
          `https://main-backend.iran.liara.run/api/v1/users/authorize/payment/user_wallet/verify?track_id=${trackId}`
        );
        console.log(response);
      }
    })();
  }, [router.query]);
  return (
    <div
      style={{
        marginTop: "32px",
        width: "100%",
        textAlign: "center",
        fontSize: "20px",
      }}
    >
      درحال بررسی پرداخت...{" "}
    </div>
  );
};

export default Payment;
