import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  AiFillCloseCircle,
  AiFillDelete,
  AiOutlineFileDone,
} from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import styles from "./Update.module.css";
import { toast } from "react-toastify";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { TiArrowBackOutline } from "react-icons/ti";

import { Transition, getUser } from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";
import { useAddress } from "@thirdweb-dev/react";

const UpdateDetails = () => {
  const [userData, setUserData] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;

  const address = useAddress();
  address !== undefined ? (setProceed = true) : (setProceed = false);

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
  //   const [password, setPassword] = useState({
  //     currentPassword: "",
  //     newPassword: "",
  //   });
  //   const [showPassword, setShowPassword] = useState(false);
  //   const [showNewPassword, setShowNewPassword] = useState(false);
  //   const handleClickShowPassword = () => {
  //     setShowPassword(!showPassword);
  //   };

  let navigate = useNavigate();
  useEffect(() => {
    setProceed ? getUserData() : navigate("/");
  }, []);

  const getUserData = async () => {
    try {
      getUser(address, setUserData);
      userDetails.firstName = userData.firstName ?? "";
      userDetails.lastName = userData.lastName ?? "";
      userDetails.email = userData.email ?? "";
      userDetails.phoneNumber = userData.phoneNumber ?? "";
      userDetails.province = userData.province ?? "";
      userDetails.district = userData.district ?? "";
      userDetails.ward = userData.ward ?? "";
      userDetails.detail = userData.detail ?? "";
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 500, theme: "colored" });
    }
  };
  const handleOnchange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  let phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !userDetails.email &&
        !userDetails.firstName &&
        !userDetails.phoneNumber &&
        !userDetails.lastName &&
        !userDetails.province &&
        !userDetails.district &&
        !userDetails.ward &&
        !userDetails.detail
      ) {
        toast.error("Hãy điền tất cả các trường", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (
        userDetails.firstName.length < 3 ||
        userDetails.lastName.length < 3
      ) {
        toast.error("Tên phải dài hơn 3 kí tự", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!emailRegex.test(userDetails.email)) {
        toast.error("Hãy điền email chính xác", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!phoneRegex.test(userDetails.phoneNumber)) {
        toast.error("Hãy điền SĐT chính xác", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!userDetails.address) {
        toast.error("Please add address", { autoClose: 500, theme: "colored" });
      } else if (!userDetails.city) {
        toast.error("Please add city", { autoClose: 500, theme: "colored" });
      } else if (!userDetails.zipCode) {
        toast.error("Please enter valid Zip code", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!userDetails.userState) {
        toast.error("Please add state", { autoClose: 500, theme: "colored" });
      } else {
        const { data } = await axios.put(
          `${process.env.REACT_APP_UPDATE_USER_DETAILS}`,
          {
            userDetails: JSON.stringify(userDetails),
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        if (data.success === true) {
          toast.success("Updated Successfully", {
            autoClose: 500,
            theme: "colored",
          });
          getUserData();
        } else {
          toast.error("Something went wrong", {
            autoClose: 500,
            theme: "colored",
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data, { autoClose: 500, theme: "colored" });
    }
  };

  //   const handleResetPassword = async (e) => {
  //     e.preventDefault();
  //     try {
  //       if (!password.currentPassword && !password.newPassword) {
  //         toast.error("Please Fill the all Fields", {
  //           autoClose: 500,
  //           theme: "colored",
  //         });
  //       } else if (password.currentPassword.length < 5) {
  //         toast.error("Please enter valid password", {
  //           autoClose: 500,
  //           theme: "colored",
  //         });
  //       } else if (password.newPassword.length < 5) {
  //         toast.error("Please enter password with more than 5 characters", {
  //           autoClose: 500,
  //           theme: "colored",
  //         });
  //       } else {
  //         const { data } = await axios.post(
  //           `${process.env.REACT_APP_RESET_PASSWORD}`,
  //           {
  //             id: userData._id,
  //             currentPassword: password.currentPassword,
  //             newPassword: password.newPassword,
  //           },
  //           {
  //             headers: {
  //               Authorization: authToken,
  //             },
  //           }
  //         );
  //         toast.success(data, { autoClose: 500, theme: "colored" });
  //         setPassword(
  //           (password.currentPassword = ""),
  //           (password.newPassword = "")
  //         );
  //       }
  //     } catch (error) {
  //       toast.error(error.response.data, { autoClose: 500, theme: "colored" });
  //       console.log(error);
  //     }
  //   };

  //   const deleteAccount = async () => {
  //     try {
  //       const deleteUser = await axios.delete(
  //         `${process.env.REACT_APP_DELETE_USER_DETAILS}/${userData._id}`,
  //         {
  //           headers: {
  //             Authorization: authToken,
  //           },
  //         }
  //       );
  //       toast.success("Account deleted successfully", {
  //         autoClose: 500,
  //         theme: "colored",
  //       });
  //       localStorage.removeItem("Authorization");
  //       sessionStorage.removeItem("totalAmount");
  //       navigate("/login");
  //     } catch (error) {
  //       toast.error(error.response.data, { autoClose: 500, theme: "colored" });
  //     }
  //   };

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
        <Typography
          variant="h5"
          sx={{ margin: "30px 0", fontWeight: "bold", color: "#1976d2" }}
        >
          Thông tin cá nhân
        </Typography>
        <form
          noValidate
          autoComplete="off"
          className={styles.checkout_form}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên"
                name="firstName"
                value={userDetails.firstName || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ"
                name="lastName"
                value={userDetails.lastName || ""}
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
                value={userDetails.phoneNumber || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={userDetails.email || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tỉnh/Thành phố"
                name="address"
                value={userDetails.address || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quận/Huyện"
                name="city"
                value={userDetails.city || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="tel"
                label="Xã/Phường"
                name="zipCode"
                value={userDetails.zipCode || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Địa chỉ chi tiết"
                name="userState"
                value={userDetails.userState || ""}
                onChange={handleOnchange}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Container
            sx={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 5,
            }}
          >
            <Button
              variant="contained"
              endIcon={<TiArrowBackOutline />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              endIcon={<AiOutlineFileDone />}
              type="submit"
            >
              Lưu
            </Button>
          </Container>
        </form>

        {/* <Typography
          variant="h6"
          sx={{ margin: "20px 0", fontWeight: "bold", color: "#1976d2" }}
        >
          Reset Password
        </Typography>
        <form onSubmit={handleResetPassword}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Current Password"
                name="currentPassword"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={handleClickShowPassword}
                      sx={{ cursor: "pointer" }}
                    >
                      {showPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                    </InputAdornment>
                  ),
                }}
                value={password.currentPassword || ""}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    [e.target.name]: e.target.value,
                  })
                }
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                id="password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      sx={{ cursor: "pointer" }}
                    >
                      {showNewPassword ? <RiEyeFill /> : <RiEyeOffFill />}
                    </InputAdornment>
                  ),
                }}
                value={password.newPassword || ""}
                onChange={(e) =>
                  setPassword({
                    ...password,
                    [e.target.name]: e.target.value,
                  })
                }
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "25px 0",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<RiLockPasswordLine />}
              type="submit"
            >
              Reset
            </Button>
          </Box>
        </form> */}

        {/* <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            margin: "25px 0",
            width: "100%",
          }}
        >
          <Typography variant="h6">Delete Your Account?</Typography>
          <Button
            variant="contained"
            color="error"
            endIcon={<AiFillDelete />}
            onClick={() => setOpenAlert(true)}
          >
            Delete
          </Button>
        </Box> */}

        <Dialog
          open={openAlert}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenAlert(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
          <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
            <DialogContentText
              style={{ textAlign: "center" }}
              id="alert-dialog-slide-description"
            >
              <Typography variant="body1">
                Your all data will be erased
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            {/* <Button
              variant="contained"
              endIcon={<AiFillDelete />}
              color="error"
              onClick={deleteAccount}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAlert(false)}
              endIcon={<AiFillCloseCircle />}
            >
              Close
            </Button> */}
          </DialogActions>
        </Dialog>
      </Container>
      <CopyRight sx={{ mt: 4, mb: 10 }} />
    </>
  );
};

export default UpdateDetails;
