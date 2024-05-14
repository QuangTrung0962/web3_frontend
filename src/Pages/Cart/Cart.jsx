import React, { useContext, useEffect, useState } from "react";
import { ContextFunction } from "../../Context/Context";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Container,
  CssBaseline,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillCloseCircle, AiOutlineLogin } from "react-icons/ai";
import CartCard from "../../Components/Card/CartCard/CartCard";
import ProductCard from "../../Components/Card/Product Card/ProductCard";
import "./Cart.css";
import OrderSummary from "./OrderSummary";
import { EmptyCart } from "../../Assets/Images/Image";
import {
  CONTRACT_AUTH_ADDRESS,
  Transition,
  getUser,
} from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";

const Cart = () => {
  const { cart, setCart, quantity } = useContext(ContextFunction);
  const [total, setTotal] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [previousOrder, setPreviousOrder] = useState([]);
  let shippingCoast = 30000;

  const navigate = useNavigate();
  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;

  const address = useAddress();
  address !== undefined ? (setProceed = true) : (setProceed = false);

  const { contract } = useContract(CONTRACT_AUTH_ADDRESS);
  const { mutateAsync: addNewUser } = useContractWrite(contract, "addUser");
  const [checkUser, setCheckUser] = useState();

  console.log(quantity);
  useEffect(() => {
    if (setProceed) {
      //getCart();
      //getPreviousOrder();
      getUser(address, setCheckUser);
    } else {
      setOpenAlert(true);
    }
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    let productQuantity = 1;

    if (setProceed) {
      setTotal(
        cart.reduce((acc, curr) => {
          // Tìm phần tử trong mảng quantity có id trùng với id của phần tử hiện tại trong cart
          const matchingQuantity = quantity.find(
            (q) => q.id === curr.id.toString()
          );
          // Lấy quantity từ matchingQuantity nếu tìm thấy, nếu không lấy 1
          const quantityValue = matchingQuantity
            ? matchingQuantity.quantity
            : 1;

          // Tính tổng
          return acc + (parseInt(curr?.price) * quantityValue + shippingCoast);
        }, 0)
      );
    }
  }, [cart]);

  //   const getCart = async () => {
  //     if (setProceed) {
  //       const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       });
  //       setCart(data);
  //     }
  //   };

  const handleClose = () => {
    setOpenAlert(false);
    navigate("/");
  };
  const handleToLogin = () => {
    navigate("/login");
  };

  // const getPreviousOrder = async () => {
  //   const { data } = await axios.get(
  //     `${process.env.REACT_APP_GET_PREVIOUS_ORDER}`,
  //     {
  //       headers: {
  //         Authorization: authToken,
  //       },
  //     }
  //   );
  //   setPreviousOrder(data);
  // };

  const removeFromCart = async (product) => {
    if (setProceed) {
      try {
        const productIdToRemove = product.id;
        toast.success("Xóa sản phẩm thành công", {
          autoClose: 500,
          theme: "colored",
        });

        // Lọc bỏ sản phẩm có _id trùng khớp với _id của sản phẩm cần xóa
        // Cập nhật giỏ hàng với danh sách sản phẩm mới
        setCart(cart.filter((product) => product.id !== productIdToRemove));
      } catch (error) {
        toast.error("Something went wrong", {
          autoClose: 500,
          theme: "colored",
        });
      }
    }
  };
  const proceedToCheckout = async () => {
    if (cart.length <= 0) {
      toast.error("Hãy thêm sản phẩm vào giỏ hàng", {
        autoClose: 500,
        theme: "colored",
      });
    } else {
      sessionStorage.setItem("totalAmount", total);
      //Add user

      if (checkUser === undefined) {
        await addNewUser({ args: [address, "", "", "", "", "", "", "", ""] });
      }

      navigate("/checkout");
    }
  };

  return (
    <>
      <CssBaseline />
      <Container fixed maxWidth>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            marginTop: 10,
            color: "#1976d2",
            fontWeight: "bold",
          }}
        >
          Giỏ hàng
        </Typography>
        {setProceed && cart.length <= 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="main-card">
              <img
                src={EmptyCart}
                alt="Empty_cart"
                className="empty-cart-img"
              />
              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  color: "#1976d2",
                  fontWeight: "bold",
                }}
              >
                Giỏ hàng của bạn đang trống
              </Typography>
            </div>
          </Box>
        )}
        <Container sx={{ display: "flex", flexDirection: "column", mb: 10 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {cart.length > 0 &&
              cart.map((product) => (
                <CartCard
                  product={product}
                  removeFromCart={removeFromCart}
                  key={product.id}
                  quantity={quantity}
                />
              ))}
          </Box>

          {cart.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OrderSummary
                proceedToCheckout={proceedToCheckout}
                total={total}
                shippingCoast={shippingCoast}
              />
            </Box>
          )}
        </Container>
      </Container>

      {/* {setProceed && previousOrder.length > 0 && (
        <Typography variant="h6" sx={{ textAlign: "center", margin: "5px 0" }}>
          Previous Orders
        </Typography>
      )} */}
      {/* <Container
        maxWidth="xl"
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          paddingBottom: 20,
        }}
      >
        {previousOrder.map((product) =>
          product.productData.map((prod) => (
            <Link
              to={`/Detail/type/${prod.productId.type}/${prod.productId._id}`}
              key={prod._id}
            >
              <ProductCard prod={prod.productId} />
            </Link>
          ))
        )}
      </Container> */}

      <Dialog
        open={openAlert}
        keepMounted
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent
          sx={{
            width: { xs: 280, md: 350, xl: 400 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5">Xin hãy đăng nhập</Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            variant="contained"
            onClick={handleToLogin}
            endIcon={<AiOutlineLogin />}
            color="primary"
          >
            Đăng nhập
          </Button>
          <Button
            variant="contained"
            color="error"
            endIcon={<AiFillCloseCircle />}
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default Cart;
