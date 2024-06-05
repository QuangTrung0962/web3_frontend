import {
  Button,
  Collapse,
  Container,
  Grid,
  IconButton,
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
import { AiFillDelete, AiOutlineFileDone } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import styles from "./Update.module.css";
import { toast } from "react-toastify";
import { TiArrowBackOutline } from "react-icons/ti";
import {
  CONTRACT_ORDER_ADDRESS,
  CONTRACT_PRODUCT_ADDRESS,
  getUser,
  numberWithCommas,
} from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";
import {
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const UserDetail = () => {
  const [userData, setUserData] = useState([]);
  let setProceed = false;

  const address = useAddress();
  address !== undefined ? (setProceed = true) : (setProceed = false);

  const [openOrderId, setOpenOrderId] = useState("");
  const [products, setProducts] = useState([]);

  const { contract: contractOrder } = useContract(CONTRACT_ORDER_ADDRESS);

  const { data: orders } = useContractRead(contractOrder, "getAllOrders");
  let filteredOrders = orders?.filter((order) => order.user === address);
  let reversedOrders = filteredOrders ? [...filteredOrders].reverse() : [];

  let navigate = useNavigate();
  useEffect(() => {
    if (setProceed) {
      getUserData();
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsMap = {};
      for (const order of reversedOrders) {
        for (const item of order.items) {
          if (!productsMap[item.productId]) {
            productsMap[item.productId] = await getSingleProduct(
              item.productId
            );
          }
        }
      }
      setProducts(productsMap);
    };

    if (reversedOrders?.length > 0) {
      fetchProducts();
    }
    //reversedOrders
  }, [orders]);

  const getSingleProduct = async (id) => {
    const SDK = new ThirdwebSDK("sepolia");
    const contract = await SDK.getContract(CONTRACT_PRODUCT_ADDRESS);
    const data = await contract.call("getProductById", [id.toString()]);
    return data;
  };

  const deleteOrder = async (id) => {
    await contractOrder.call("delelteOrder", [id.toString()]);
    toast.success("Yều cầu hủy đơn thành công", {
      autoClose: 500,
      theme: "colored",
    });
  };

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
        <form noValidate autoComplete="off" className={styles.checkout_form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                inputProps={{ readOnly: true }}
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
                inputProps={{ readOnly: true }}
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
                inputProps={{ readOnly: true }}
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
                inputProps={{ readOnly: true }}
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
                inputProps={{ readOnly: true }}
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
                inputProps={{ readOnly: true }}
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
                inputProps={{ readOnly: true }}
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
                inputProps={{ readOnly: true }}
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
              onClick={() => navigate("/update")}
            >
              Cập nhật
            </Button>
          </Container>
        </form>
      </Container>
      <>
        {/* Danh sách đơn hàng */}
        <Typography
          variant="h5"
          sx={{ margin: "30px 0", fontWeight: "bold", color: "#1976d2" }}
          style={{ textAlign: "center" }}
        >
          Đơn hàng
        </Typography>

        <Paper
          style={{
            overflow: "auto",
            maxHeight: "500px",
          }}
        >
          <TableContainer sx={{ maxHeight: "500px" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead sx={{ position: "sticky", top: 0 }}>
                <TableRow>
                  <TableCell />
                  <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                    Ngày đặt hàng
                  </TableCell>
                  <TableCell sx={{ color: "#1976d2", fontWeight: "bold" }}>
                    Tổng tiền
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reversedOrders &&
                  reversedOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() =>
                              setOpenOrderId(
                                openOrderId === order.id ? "" : order.id
                              )
                            }
                          >
                            {<MdKeyboardArrowDown />}
                          </IconButton>
                        </TableCell>

                        <TableCell component="th" scope="row">
                          <p style={{ fontSize: "16px" }}>{order.timestamp}</p>
                        </TableCell>
                        <TableCell>
                          <p style={{ fontSize: "16px", color: "red" }}>
                            {numberWithCommas(order.total.toString())}đ
                          </p>
                        </TableCell>

                        {order.status === "" && (
                          <TableCell>
                            <Button
                              className="all-btn"
                              sx={{ width: 120 }}
                              variant="contained"
                              color="error"
                              onClick={() => deleteOrder(order.id)}
                            >
                              <AiFillDelete style={{ fontSize: 15 }} />
                              Hủy đơn
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={openOrderId === order.id}
                            timeout="auto"
                            unmountOnExit
                          >
                            <div>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>

                                    <TableCell
                                      align="left"
                                      sx={{
                                        color: "#1976d2",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Tên sản phẩm
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      sx={{
                                        color: "#1976d2",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Hình ảnh
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      sx={{
                                        color: "#1976d2",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Giá
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      sx={{
                                        color: "#1976d2",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Số lượng
                                    </TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {order?.items?.map((item, itemIndex) => {
                                    const product = products[item.productId];
                                    return (
                                      <>
                                        {product ? (
                                          <TableRow key={itemIndex}>
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="left">
                                              <p>{product.productName}</p>
                                            </TableCell>
                                            <TableCell align="left">
                                              <p>
                                                <img
                                                  src={product.images[0]}
                                                  alt="img"
                                                  style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              </p>
                                            </TableCell>
                                            <TableCell align="left">
                                              <p>
                                                {numberWithCommas(
                                                  product.price.toString()
                                                )}
                                                đ
                                              </p>
                                            </TableCell>
                                            <TableCell align="left">
                                              <p>{item?.quantity.toString()}</p>
                                            </TableCell>
                                          </TableRow>
                                        ) : (
                                          <TableRow>
                                            <p>Loading product details...</p>
                                          </TableRow>
                                        )}
                                      </>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </>
      <CopyRight sx={{ mt: 4, mb: 10 }} />
    </>
  );
};

export default UserDetail;
