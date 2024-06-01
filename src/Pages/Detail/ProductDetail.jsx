import "./Productsimilar.css";
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Tooltip,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Chip,
  ButtonGroup,
  Skeleton,
} from "@mui/material";
import { Rating } from "@mui/material";
import { MdAddShoppingCart } from "react-icons/md";
import {
  AiFillHeart,
  AiFillCloseCircle,
  AiOutlineLogin,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { TbDiscount2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { ContextFunction } from "../../Context/Context";
import ProductReview from "../../Components/Review/ProductReview";
import {
  Transition,
  getSingleProduct,
  handleRating,
  numberWithCommas,
} from "../../Constants/Constant";
import CopyRight from "../../Components/CopyRight/CopyRight";
import { useAddress } from "@thirdweb-dev/react";

const ProductDetail = () => {
  const {
    cart,
    setCart,
    wishlistData,
    setWishlistData,
    setQuantity,
    quantity,
  } = useContext(ContextFunction);
  const [openAlert, setOpenAlert] = useState(false);
  const { id, cat } = useParams();
  const [product, setProduct] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);

  let authToken = localStorage.getItem("Authorization");
  let setProceed = authToken ? true : false;
  const address = useAddress();
  address !== undefined ? (setProceed = true) : (setProceed = false);

  console.log("object", id);
  useEffect(() => {
    handleRating(id, setRating);
  }, []);

  useEffect(() => {
    getSingleProduct(setProduct, id, setLoading);
    window.scroll(0, 0);
  }, [id]);

  const addToCart = async (product) => {
    if (setProceed) {
      try {
        setCart([...cart, product]);

        setQuantity([
          ...quantity,
          { id: product.id.toString(), quantity: productQuantity },
        ]);
        toast.success("Thêm vào giỏ hàng", {
          autoClose: 500,
          theme: "colored",
        });
      } catch (error) {
        toast.error(error.response.data.msg, {
          autoClose: 500,
          theme: "colored",
        });
      }
    } else {
      setOpenAlert(true);
    }
  };

  const addToWhishList = async (product) => {
    if (setProceed) {
      try {
        setWishlistData([...wishlistData, product]);

        toast.success("Thêm vào yêu thích", {
          autoClose: 500,
          theme: "colored",
        });
      } catch (error) {
        toast.error(error.response.data.msg, {
          autoClose: 500,
          theme: "colored",
        });
      }
    } else {
      setOpenAlert(true);
    }
  };

  const shareProduct = (product) => {
    const data = {
      text: product.name,
      title: "e-shopit",
      url: ``,
    };
    if (navigator.canShare && navigator.canShare(data)) {
      navigator.share(data);
    } else {
      toast.error("browser not support", { autoClose: 500, theme: "colored" });
    }
  };

  let data = [];
  if (cat === "shoe") {
    data.push(product?.brand, product?.gender, product?.category);
  } else if (cat === "book") {
    data.push(product.author, product.category);
  } else if (cat === "cloths") {
    data.push(product.category, cat);
  } else if (cat === "electronics") {
    data.push(product.category, cat);
  } else if (cat === "jewelry") {
    data.push(cat);
  }

  const increaseQuantity = () => {
    setProductQuantity(productQuantity + 1);
    if (productQuantity >= 5) {
      setProductQuantity(5);
    }
  };
  const decreaseQuantity = () => {
    setProductQuantity((prev) => prev - 1);
    if (productQuantity <= 1) {
      setProductQuantity(1);
    }
  };

  return (
    <>
      <Container maxWidth="xl">
        <Dialog
          open={openAlert}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenAlert(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 } }}>
            <DialogContentText
              style={{ textAlign: "center" }}
              id="alert-dialog-slide-description"
            >
              Xin hãy đăng nhập
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <Link to="/login">
              {" "}
              <Button
                variant="contained"
                endIcon={<AiOutlineLogin />}
                color="primary"
              >
                Đăng nhập
              </Button>
            </Link>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenAlert(false)}
              endIcon={<AiFillCloseCircle />}
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        <main className="main-content">
          {loading ? (
            <Skeleton variant="rectangular" height={400} />
          ) : (
            <div className="product-image">
              <div className="detail-img-box">
                <img
                  alt={product.productName}
                  src={product.images[0]}
                  className="detail-img"
                />
                <br />
              </div>
            </div>
          )}
          {loading ? (
            <section
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Skeleton variant="rectangular" height={200} width="200px" />
              <Skeleton variant="text" height={400} width={700} />
            </section>
          ) : (
            <section className="product-details">
              <Typography variant="h4">{product.productName}</Typography>

              <Typography>{product.description}</Typography>
              <Chip
                label={"Giảm giá 30%"}
                variant="outlined"
                sx={{
                  background: "#1976d2",
                  color: "white",
                  width: "150px",
                  fontWeight: "bold",
                }}
                avatar={<TbDiscount2 color="white" />}
              />
              <div style={{ display: "flex", gap: 20 }}>
                <Typography variant="h6" color="primary">
                  {numberWithCommas(product.price.toString())}đ
                </Typography>
                <Typography variant="h6" color="red">
                  <s>
                    {numberWithCommas(
                      (
                        parseFloat(product.price) +
                        parseFloat(product.price) * 0.3
                      ).toString()
                    )}
                    đ
                  </s>
                </Typography>
              </div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  // background: 'red',
                  "& > *": {
                    m: 1,
                  },
                }}
              >
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <Button onClick={() => increaseQuantity()}>+</Button>
                  <Button>{productQuantity}</Button>
                  <Button onClick={decreaseQuantity}>-</Button>
                </ButtonGroup>
              </Box>
              <Rating precision={1} name="read-only" value={rating} readOnly />
              <div style={{ display: "flex" }}>
                <Tooltip title="Mua hàng">
                  <Button
                    variant="contained"
                    className="all-btn"
                    startIcon={<MdAddShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Mua
                  </Button>
                </Tooltip>
                <Tooltip title="Thêm vào yêu thích">
                  <Button
                    style={{ marginLeft: 10 }}
                    size="small"
                    variant="contained"
                    className="all-btn"
                    onClick={() => addToWhishList(product)}
                  >
                    {<AiFillHeart fontSize={21} />}
                  </Button>
                </Tooltip>
                <Tooltip title="Chia sẻ">
                  <Button
                    style={{ marginLeft: 10 }}
                    variant="contained"
                    className="all-btn"
                    startIcon={<AiOutlineShareAlt />}
                    onClick={() => shareProduct(product)}
                  >
                    Share
                  </Button>
                </Tooltip>
              </div>
            </section>
          )}
        </main>

        {/* PRODUCT REVIEW  */}
        <ProductReview
          setProceed={setProceed}
          authToken={authToken}
          id={id}
          setOpenAlert={setOpenAlert}
        />
      </Container>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default ProductDetail;
