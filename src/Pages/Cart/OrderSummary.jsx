import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { numberWithCommas } from "../../Constants/Constant";

const OrderSummary = ({ proceedToCheckout, total, shippingCoast }) => {
  return (
    <Card
      sx={{ width: { xs: 450, sm: 550, md: 550, lg: 700 } }}
      // className={classes.root}

      elevation={15}
    >
      <CardContent>
        <Typography variant="div" component="h1">
          Đơn hàng
        </Typography>
        <Typography variant="subtitle2">
          <hr />
        </Typography>
        <Grid sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Typography variant="body1" component="div" color="primary">
              Tạm tính
            </Typography>
            <Typography variant="h6" component="div" color="primary">
              {numberWithCommas(total - shippingCoast)}đ
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Typography variant="body1" component="div" color="primary">
              Phí vận chuyển
            </Typography>
            <Typography variant="h6" component="div" color="primary">
              {numberWithCommas(shippingCoast)}đ
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Typography variant="body1" component="div" color="primary">
              Tổng tiền
            </Typography>
            <Typography variant="h6" component="div" color="red">
              {numberWithCommas(total)}đ
            </Typography>
          </Box>
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          size="large"
          endIcon={<IoBagCheckOutline />}
          color="primary"
          onClick={proceedToCheckout}
        >
          Thanh toán
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderSummary;
