import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./Chekout.module.css";
import { BsFillCartCheckFill } from "react-icons/bs";
import { MdUpdate } from "react-icons/md";
import { ContextFunction } from "../../Context/Context";
import { Link, useNavigate } from "react-router-dom";
import { profile } from "../../Assets/Images/Image";
import { toast } from "react-toastify";
import CopyRight from "../CopyRight/CopyRight";
import {
  CONTRACT_ORDER_ADDRESS,
  Transition,
  getUser,
  handleClose,
} from "../../Constants/Constant";
import { AiFillCloseCircle, AiOutlineSave } from "react-icons/ai";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { format } from "date-fns";
//import { toWei } from "thirdweb-dev/sdk";

const CheckoutForm = () => {
  const { cart, quantity } = useContext(ContextFunction);
  const [userData, setUserData] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);

  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;
  let navigate = useNavigate();
  let totalAmount = sessionStorage.getItem("totalAmount");

  const address = useAddress();
  address !== undefined ? (setProceed = true) : (setProceed = false);
  const { contract } = useContract(CONTRACT_ORDER_ADDRESS);
  const {
    mutateAsync: checkout,
    isSuccess: createOrderSuccess,
    isError,
  } = useContractWrite(contract, "checkout");

  useEffect(() => {
    if (setProceed) {
      getUserDetailData();
    } else {
      navigate("/");
    }
  }, []);

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    detail: "",
  });

  const getUserDetailData = async () => {
    try {
      // const { data } = await axios.get(
      //   `${process.env.REACT_APP_GET_USER_DETAILS}`,
      //   {
      //     headers: {
      //       Authorization: authToken,
      //     },
      //   }
      // );
      // setUserData(data);

      // if (!data.address || !data.city || !data.zipCode || !data.userState) {
      //   setOpenAlert(true);
      //   console.log(1);
      // }
      getUser(address, setUserData);

      // userDetails.firstName = userData.firstName;
      // userDetails.lastName = userData.lastName;
      // userDetails.email = userData.email;
      // userDetails.phoneNumber = userData.phoneNumber;
      // userDetails.province = userData.province;
      // userDetails.district = userData.district;
      // userDetails.ward = userData.ward;
      // userDetails.detail = userData.detail;
    } catch (error) {
      console.log(error);
    }
  };

  const checkOutHandler = async (e) => {
    e.preventDefault();

    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.phoneNumber ||
      !userData.province ||
      !userData.district ||
      !userData.ward ||
      !userData.detail
    ) {
      toast.error("Hãy điền tất cả các trường", {
        autoClose: 500,
        theme: "colored",
      });
    } else {
      //Call payment method
      try {
        // const {
        //   data: { key },
        // } = await axios.get(`${process.env.REACT_APP_GET_KEY}`);
        // const { data } = await axios.post(
        //   `${process.env.REACT_APP_GET_CHECKOUT}`,
        //   {
        //     amount: totalAmount,
        //     productDetails: JSON.stringify(cart),
        //     userId: userData._id,
        //     userDetails: JSON.stringify(userDetails),
        //   }
        // );
        // const options = {
        //   key: key,
        //   amount: totalAmount,
        //   currency: "INR",
        //   name: userData.firstName + " " + userData.lastName,
        //   description: "Payment",
        //   image: profile,
        //   order_id: data.order.id,
        //   callback_url: process.env.REACT_APP_GET_PAYMENTVERIFICATION,
        //   prefill: {
        //     name: userData.firstName + " " + userData.lastName,
        //     email: userData.email,
        //     contact: userData.phoneNumber,
        //   },
        //   notes: {
        //     address: `${userData.address} ${userData.city} ${userData.zipCode} ${userData.userState}`,
        //   },
        //   theme: {
        //     color: "#1976d2",
        //   },
        // };
        // const razor = new window.Razorpay(options);
        // razor.open();

        const currentTime = new Date();
        const formattedTime = format(currentTime, "dd/MM/yyyy HH:mm:ss");
        const combinedData = cart.map((cartItem) => {
          const quantityItem = quantity.find(
            (q) => q.id === cartItem.id.toString()
          );
          return [
            parseInt(cartItem.id),
            cartItem.productName,
            quantityItem ? quantityItem.quantity : 0, // Sử dụng 0 nếu không tìm thấy quantity
          ];
        });
        await checkout({
          args: [formattedTime, totalAmount, cart.length, combinedData],
        });
        toast.success("Thanh toán thành công", {
          autoClose: 500,
          theme: "colored",
        });

        navigate("/paymentsuccess");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOnchange = (e) => {
    //setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Container
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: 10,
        }}
      >
        <Typography variant="h5" sx={{ margin: "20px 0" }}>
          Thanh toán
        </Typography>
        <form
          noValidate
          autoComplete="off"
          className={styles.checkout_form}
          onSubmit={checkOutHandler}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                // inputProps={{ readOnly: true }}
                // disabled
                label="Tên"
                name="firstName"
                value={userData.firstName || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ đệm"
                name="lastName"
                value={userData.lastName || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SĐT"
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={userData.email || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Tỉnh/Thành phố"
                name="province"
                value={userData.province || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quận/Huyện"
                name="district"
                value={userData.district || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="tel"
                label="Phường/Xã"
                name="ward"
                value={userData.ward || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Địa chỉ chi tiết"
                name="detail"
                value={userData.detail || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Container
            sx={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              marginTop: 5,
            }}
          >
            <Link to="/update">
              <Button variant="contained" endIcon={<MdUpdate />}>
                Cập nhật
              </Button>
            </Link>
            <Button
              variant="contained"
              endIcon={<BsFillCartCheckFill />}
              type="submit"
            >
              Thanh toán
            </Button>
          </Container>
        </form>

        <Dialog
          open={openAlert}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => handleClose(setOpenAlert)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Link to="/update">
              <Button
                variant="contained"
                endIcon={<AiOutlineSave />}
                color="primary"
              >
                Add
              </Button>
            </Link>
            <Button
              variant="contained"
              color="error"
              endIcon={<AiFillCloseCircle />}
              onClick={() => handleClose(setOpenAlert)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default CheckoutForm;
