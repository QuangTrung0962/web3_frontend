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

import {
  CONTRACT_AUTH_ADDRESS,
  Transition,
  getUser,
} from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";

const UpdateDetails = () => {
  const [userData, setUserData] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;

  const address = useAddress();
  address !== undefined ? (setProceed = true) : (setProceed = false);
  const { contract } = useContract(CONTRACT_AUTH_ADDRESS);
  const { mutateAsync: editUser, isError: editUserError } = useContractWrite(
    contract,
    "editUser"
  );

  // const [userDetails, setUserDetails] = useState({
  //   firstName: "",
  //   lastName: "",
  //   phoneNumber: "",
  //   email: "",
  //   province: "",
  //   district: "",
  //   ward: "",
  //   detail: "",
  // });

  let navigate = useNavigate();
  useEffect(() => {
    if (setProceed) {
      getUserData();
    } else {
      navigate("/");
    }
  }, []);

  const getUserData = async () => {
    try {
      getUser(address, setUserData);
    } catch (error) {
      toast.error("Something went wrong", { autoClose: 500, theme: "colored" });
    }
  };
  const handleOnchange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  let phoneRegex = /^(?:\+84|0)(?:3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8}|2\d{9})$/;
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !userData.email &&
        !userData.firstName &&
        !userData.phoneNumber &&
        !userData.lastName &&
        !userData.province &&
        !userData.district &&
        !userData.ward &&
        !userData.detail
      ) {
        toast.error("Hãy điền tất cả các trường", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (
        userData.firstName.length < 3 ||
        userData.lastName.length < 3
      ) {
        toast.error("Tên phải dài hơn 3 kí tự", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!emailRegex.test(userData.email)) {
        toast.error("Hãy điền email chính xác", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!phoneRegex.test(userData.phoneNumber)) {
        toast.error("Hãy điền SĐT chính xác", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!userData.province) {
        toast.error("Hãy điền Tỉnh/Thành phố", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!userData.district) {
        toast.error("Hãy điền Quận/Huyện", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!userData.ward) {
        toast.error("Hãy điền Phường/Xã", {
          autoClose: 500,
          theme: "colored",
        });
      } else if (!userData.detail) {
        toast.error("Hãy điền địa chỉ chi tiêt", {
          autoClose: 500,
          theme: "colored",
        });
      } else {
        await editUser({
          args: [
            address,
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.phoneNumber,
            userData.province,
            userData.district,
            userData.ward,
            userData.detail,
          ],
        });

        if (!editUserError) {
          toast.success("Cập nhật thành công", {
            autoClose: 500,
            theme: "colored",
          });
          //getUserData();
          navigate("/checkout");
        } else {
          toast.error("Xảy ra lỗi 1", {
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
                label="Xã/Phường"
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

        {/* Dialog Func */}
      </Container>
      <CopyRight sx={{ mt: 4, mb: 10 }} />
    </>
  );
};

export default UpdateDetails;
