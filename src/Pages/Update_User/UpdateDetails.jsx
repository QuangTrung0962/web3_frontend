import {
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Update.module.css";
import { toast } from "react-toastify";
import { TiArrowBackOutline } from "react-icons/ti";

import {
  CONTRACT_AUTH_ADDRESS,
  CONTRACT_ORDER_ADDRESS,
  getUser,
} from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { MdKeyboardArrowDown } from "react-icons/md";

const UpdateDetails = () => {
  const [userData, setUserData] = useState([]);
  //const [openAlert, setOpenAlert] = useState(false);
  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;

  const address = useAddress();
  address !== undefined ? (setProceed = true) : (setProceed = false);
  const [checkUser, setCheckUser] = useState();
  const [openOrderId, setOpenOrderId] = useState("");
  const { contract } = useContract(CONTRACT_AUTH_ADDRESS);
  const { contract: contractOrder } = useContract(CONTRACT_ORDER_ADDRESS);

  const { data: orders } = useContractRead(contractOrder, "getAllOrders");

  const { mutateAsync: addNewUser, isError: addUserError } = useContractWrite(
    contract,
    "addUser"
  );
  const { mutateAsync: editUser, isError: editUserError } = useContractWrite(
    contract,
    "editUser"
  );

  let navigate = useNavigate();
  useEffect(() => {
    if (setProceed) {
      getUserData();
      getUser(address, setCheckUser);
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
        if (checkUser === undefined) {
          await addNewUser({
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
        }

        if (!editUserError && !addUserError) {
          toast.success("Cập nhật thành công", {
            autoClose: 500,
            theme: "colored",
          });

          //getUserData();
          navigate("/checkout");
        } else {
          toast.error("Xảy ra lỗi", {
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
      </Container>

      <CopyRight sx={{ mt: 4, mb: 10 }} />
    </>
  );
};

export default UpdateDetails;
