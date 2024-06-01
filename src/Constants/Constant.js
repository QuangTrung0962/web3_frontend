import { Slide } from "@mui/material";
import axios from "axios";
import { forwardRef } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

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
  const data = await contract.call("getProductById", [id.toString()]);
  setProduct(data);
  setLoading(false);
};

const handleRating = async (id, setRating) => {
  const contractReview = await SDK.getContract(CONTRACT_REVIEW_ADDRESS);
  const reviews = await contractReview.call("getReviewsByProductId", [id]);

  if (reviews?.length === 0) {
    return 0; // Nếu không có review nào, trả về 0
  }

  const totalRating = reviews?.reduce((sum, review) => {
    return sum + parseInt(review.rating);
  }, 0);

  const averageRating = totalRating / reviews?.length;

  setRating(averageRating);
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
  handleRating,
};

export const CONTRACT_PRODUCT_ADDRESS =
  "0x35c06c6595eB0d1E932A481AEfC8DC4752eDE96F";
export const CONTRACT_CATEGORY_ADDRESS =
  "0xdd3Db257875352D8F60C1c635bC10adB8b71a7CD";
export const CONTRACT_ORDER_ADDRESS =
  "0xa334842df5D0a46483136C8C14e8A3D7eb9c3B20";
export const CONTRACT_AUTH_ADDRESS =
  "0xf4B44c8858aae0179be511c4F6a1370eFeFF84eE";
export const CONTRACT_REVIEW_ADDRESS =
  "0x729C879Cb8dD1485F84624E58F7FeF0d2B6aC23D";

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

export function shortenAddress(address) {
  // Kiểm tra xem chuỗi có phải là địa chỉ hợp lệ không
  if (address.length < 10) {
    return address; // Địa chỉ quá ngắn để rút gọn, trả về nguyên bản
  }

  const start = address.slice(0, 6); // Lấy 6 ký tự đầu tiên
  const end = address.slice(-4); // Lấy 4 ký tự cuối cùng

  return `${start}...${end}`; // Nối hai phần lại với dấu ba chấm ở giữa
}
