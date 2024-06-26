import {
  Card,
  CardActionArea,
  CardActions,
  Rating,
  CardContent,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./ProductCard.module.css";
import {
  CONTRACT_REVIEW_ADDRESS,
  handleRating,
  numberWithCommas,
} from "../../../Constants/Constant";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

export default function ProductCard({ prod, id }) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    handleRating(id, setRating);
  }, []);

  return (
    <Card className={styles.main_card}>
      <CardActionArea className={styles.card_action}>
        <Box className={styles.cart_box}>
          <img
            alt={prod.productName}
            src={prod.images[0]}
            loading="lazy"
            className={styles.cart_img}
          />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
            {prod.productName.length > 20
              ? prod.productName.slice(0, 20) + "..."
              : prod.productName}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Typography variant="h6" color="primary">
          {numberWithCommas(prod.price.toString())}₫
        </Typography>
        <Typography>
          <Rating precision={1} name="read-only" value={rating} readOnly />
        </Typography>
      </CardActions>
    </Card>
  );
}
