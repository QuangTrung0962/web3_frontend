import { Container } from "@mui/system";
import axios from "axios";
import CartCard from "../../Components/Card/CartCard/CartCard";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ContextFunction } from "../../Context/Context";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { AiFillCloseCircle, AiOutlineLogin } from "react-icons/ai";
import { EmptyCart } from "../../Assets/Images/Image";
import { Transition } from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";
import { useContract } from "@thirdweb-dev/react";

const Wishlist = () => {
  const { wishlistData, setWishlistData } = useContext(ContextFunction);
  const [openAlert, setOpenAlert] = useState(false);

  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;
  let navigate = useNavigate();

  const address = useContract();
  address !== undefined ? (setProceed = true) : (setProceed = false);

  //   useEffect(() => {
  //     getWishList();
  //   }, []);

  const getWishList = async () => {
    if (setProceed) {
      const { data } = await axios.get(
        `${process.env.REACT_APP_GET_WISHLIST}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setWishlistData(data);
    } else {
      setOpenAlert(true);
    }
  };

  const removeFromWishlist = async (product) => {
    if (setProceed) {
      try {
        // const deleteProduct = await axios.delete(
        //   `${process.env.REACT_APP_DELETE_WISHLIST}/${product._id}`,
        //   {
        //     headers: {
        //       Authorization: authToken,
        //     },
        //   }
        // );

        setWishlistData(wishlistData.filter((c) => c.id !== product.id));
        toast.success("Xóa sản phẩm thành công", {
          autoClose: 500,
          theme: "colored",
        });
      } catch (error) {
        toast.error(error, { autoClose: 500, theme: "colored" });
      }
    }
  };
  const handleClose = () => {
    setOpenAlert(false);
    navigate("/");
  };
  const handleToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          margin: "10px 0 ",
          color: "#1976d2",
          fontWeight: "bold",
        }}
      >
        Yêu thích
      </Typography>
      {setProceed && wishlistData.length <= 0 ? (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="main-card">
            <img src={EmptyCart} alt="Empty_cart" className="empty-cart-img" />
            <Typography
              variant="h6"
              sx={{ textAlign: "center", color: "#1976d2", fontWeight: "bold" }}
            >
              Bạn không có sản phẩm yêu thích
            </Typography>
          </div>
        </Box>
      ) : (
        <Container
          maxWidth="xl"
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            paddingBottom: 20,
          }}
        >
          {wishlistData &&
            wishlistData.map((product) => (
              <CartCard
                product={product}
                removeFromCart={removeFromWishlist}
                key={product.id}
              />
            ))}
        </Container>
      )}

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
          <Typography variant="h5">Hãy đăng nhập để sử dụng</Typography>
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
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default Wishlist;
