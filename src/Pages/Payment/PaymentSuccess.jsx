import { Link } from "react-router-dom";
import { AiOutlineFileDone } from "react-icons/ai";
import { Box, Button, Typography } from "@mui/material";
import { payment } from "../../Assets/Images/Image";
import "./Payment.css";
import CopyRight from "../../Components/CopyRight/CopyRight";
import { useContext, useEffect } from "react";
import { ContextFunction } from "../../Context/Context";

const PaymentSuccess = () => {
  const { setCart, setQuantity } = useContext(ContextFunction);

  useEffect(() => {
    setCart([]);
    setQuantity([]);
  }, []);

  return (
    <>
      <div className="main-payment-box">
        <Typography variant="h6" sx={{ marginTop: 1 }}>
          Thanh toán thành công{" "}
          <AiOutlineFileDone style={{ color: "#1976d2" }} />
        </Typography>
        <Typography variant="body2" textAlign="center">
          Chúng tôi đã nhận được đơn hàng của bạn.
          <br />
          Chúng tôi sẽ thông báo với bạn khi nào đơn hàng được gửi đến
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="main-payment-card">
            <img src={payment} alt="payment" className="payment-img" />
            <Link style={{ color: "white" }} to="/">
              <Button variant="contained" sx={{ borderRadius: 3 }}>
                Quay lại trang chủ
              </Button>
            </Link>
          </div>
        </Box>
      </div>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default PaymentSuccess;
