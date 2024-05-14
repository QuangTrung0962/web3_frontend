import { Slide } from "@mui/material";
import axios from "axios";
import { forwardRef } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
//
const SDK = new ThirdwebSDK("sepolia");

const getCart = async (setProceed, setCart, authToken) => {
  if (setProceed) {
    const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
      headers: {
        Authorization: authToken,
      },
    });
    setCart(data);
  }
};
const getWishList = async (setProceed, setWishlistData, authToken) => {
  if (setProceed) {
    const { data } = await axios.get(`${process.env.REACT_APP_GET_WISHLIST}`, {
      headers: {
        Authorization: authToken,
      },
    });
    setWishlistData(data);
  }
};
const handleLogOut = (setProceed, toast, navigate, setOpenAlert) => {
  if (setProceed) {
    localStorage.removeItem("Authorization");
    toast.success("Logout Successfully", { autoClose: 500, theme: "colored" });
    navigate("/");
    setOpenAlert(false);
  } else {
    toast.error("User is already logged of", {
      autoClose: 500,
      theme: "colored",
    });
  }
};

const handleClickOpen = (setOpenAlert) => {
  setOpenAlert(true);
};

const handleClose = (setOpenAlert) => {
  setOpenAlert(false);
};
const getAllProducts = async (setData) => {
  try {
    const { data } = await axios.get(process.env.REACT_APP_FETCH_PRODUCT);
    setData(data);
  } catch (error) {
    console.log(error);
  }
};

const getSingleProduct = async (setProduct, id, setLoading) => {
  const contract = await SDK.getContract(CONTRACT_PRODUCT_ADDRESS);
  const data = await contract.call("getProductById", id);
  setProduct(data);
  setLoading(false);
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export {
  getCart,
  getWishList,
  handleClickOpen,
  handleClose,
  handleLogOut,
  getAllProducts,
  getSingleProduct,
  Transition,
};

export const CONTRACT_PRODUCT_ADDRESS =
  "0x55A9a7e1c45FF45e3Ff4b8295BD901025ce0e554";
export const CONTRACT_CATERGOTY_ADDRESS =
  "0xad56Ed62ec7Cb322c7546D9a560686E031EE472C";
export const CONTRACT_ORDER_ADDRESS =
  "0x9e8Df24E23B058fF81F262C90681a668aDE435d3";
export const CONTRACT_AUTH_ADDRESS =
  "0xE9578b948129bf5d0e44747CD94aFf2cAFE6704F";

export function bigNumberToString(productId) {
  if (productId?._isBigNumber) {
    return productId.toString();
  } else {
    return parseInt(productId?.hex, 16).toString();
  }
}

export function numberWithCommas(numberString) {
  // Chuyển chuỗi số thành số nguyên
  const number = parseInt(numberString);
  // Kiểm tra nếu không phải là số
  if (isNaN(number)) return "Invalid number";

  // Chuyển số thành chuỗi và định dạng bằng cách thêm dấu phẩy sau mỗi 3 chữ số từ phải sang trái
  return number.toLocaleString("vi-VN");
}

export const getUser = async (address, setUserData) => {
  const contract = await SDK.getContract(CONTRACT_AUTH_ADDRESS);
  const data = await contract.call("getUserByAddress", [address.toString()]);
  setUserData(data);
};
