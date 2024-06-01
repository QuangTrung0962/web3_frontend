import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Rating,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import styles from "./CartCard.module.css";
import { handleRating, numberWithCommas } from "../../../Constants/Constant";
import { useEffect, useState } from "react";

const CartCard = ({ product, removeFromCart, quantity }) => {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    handleRating(product?.id, setRating);
  }, []);

  //Check quantity
  const matchingItem = quantity?.find(
    (item) => item.id === product.id.toString()
  );

  return (
    <Card className={styles.main_cart}>
      <Link to={`/product/${product?.id}`}>
        <CardActionArea className={styles.card_action}>
          <Box className={styles.img_box}>
            <img
              alt="img"
              loading="lazy"
              src={product?.images[0]}
              className={styles.img}
            />
          </Box>
          <CardContent>
            <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
              {product?.productName.length > 20
                ? product?.productName.slice(0, 20) + "..."
                : product?.productName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                // background: 'red',
                justifyContent: "center",
                "& > *": {
                  m: 1,
                },
              }}
            >
              {matchingItem && (
                <Button>
                  <Typography variant="body2" color="black">
                    Số lượng: {matchingItem.quantity}
                  </Typography>
                </Button>
              )}

              <Typography
                gutterBottom
                variant="h6"
                sx={{ textAlign: "center" }}
                style={{ color: "red" }}
              >
                {numberWithCommas(product.price.toString())}đ
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Tooltip title="Xóa khỏi giỏ hàng">
          <Button
            className="all-btn"
            sx={{ width: 10, borderRadius: "30px" }}
            variant="contained"
            color="error"
            onClick={() => removeFromCart(product)}
          >
            <AiFillDelete style={{ fontSize: 15 }} />
          </Button>
        </Tooltip>
        <Typography>
          <Rating name="read-only" value={rating} readOnly precision={0.5} />
        </Typography>
      </CardActions>
    </Card>
  );
};

export default CartCard;
