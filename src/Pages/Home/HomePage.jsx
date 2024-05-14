import React, { useEffect } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useContext } from "react";
import { ContextFunction } from "../../Context/Context";
import CategoryCard from "../../Components/Category_Card/CategoryCard";
import BannerData from "../../Helpers/HomePageBanner";
import Carousel from "../../Components/Carousel/Carousel";
import SearchBar from "../../Components/SearchBar/SearchBar";
import CopyRight from "../../Components/CopyRight/CopyRight";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { CONTRACT_PRODUCT_ADDRESS } from "../../Constants/Constant";

const HomePage = () => {
  const { setCart } = useContext(ContextFunction);
  let authToken = localStorage.getItem("Authorization");

  const { contract } = useContract(CONTRACT_PRODUCT_ADDRESS);
  const { data: products } = useContractRead(contract, "getAllProducts");

  useEffect(() => {
    getCart();
    window.scroll(0, 0);
  }, []);
  const getCart = async () => {
    if (authToken !== null) {
      const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
        headers: {
          Authorization: authToken,
        },
      });
      setCart(data);
    }
  };

  return (
    <>
      <Container
        maxWidth="xl"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 0,
          flexDirection: "column",
          marginBottom: 70,
        }}
      >
        <Box padding={1}>
          <Carousel />
        </Box>
        <Container
          style={{ marginTop: 90, display: "flex", justifyContent: "center" }}
        >
          <SearchBar />
        </Container>
        
        {/* San pham moi */}
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            marginTop: 10,
            color: "#1976d2",
            fontWeight: "bold",
          }}
        >
          Sản phẩm mới
        </Typography>
        <Container
          maxWidth="xl"
          style={{
            marginTop: 90,
            display: "flex",
            justifyContent: "center",
            flexGrow: 1,
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          {products &&
            products.slice(0, 6).map((data) => (
              //CategoryCardw  => san pham moi
              <CategoryCard data={data} key={data.images[0]} />
            ))}
        </Container>
      </Container>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default HomePage;
