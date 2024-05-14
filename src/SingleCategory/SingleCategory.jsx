import "./singlecategory.css";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/system";
import { Box, Button, MenuItem, FormControl, Select } from "@mui/material";
import Loading from "../Components/loading/Loading";
import { BiFilterAlt } from "react-icons/bi";
import ProductCard from "../Components/Card/Product Card/ProductCard";
import CopyRight from "../Components/CopyRight/CopyRight";

//
import { useContractRead, useContract } from "@thirdweb-dev/react";
import { CONTRACT_PRODUCT_ADDRESS } from "../Constants/Constant";

const SingleCategory = () => {
  const [productData, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOption, setFilterOption] = useState("Tất cả");
  const [title, setTitle] = useState("Tất cả");
  const { cat, id } = useParams();

  const { contract } = useContract(CONTRACT_PRODUCT_ADDRESS);
  const { data: products } = useContractRead(
    contract,
    "getProductByCategoryId",
    [id]
  );

  useEffect(() => {
    getCategoryProduct();
    window.scroll(0, 0);
  }, []);

  const getCategoryProduct = async () => {
    try {
      //cat = Samsung
      setIsLoading(true);

      if (products != null) {
        setIsLoading(false);
        setProductData(products);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const productFilter = [];

  if (cat !== "") {
    productFilter.push(
      "Tất cả",
      "Giá từ thấp đến cao",
      "Giá từ cao đến thấp",
      "Đánh giá cao",
      "Đánh giá thấp"
    );
  }

  const handleChange = (e) => {
    setFilterOption(e.target.value.split(" ").join("").toLowerCase());
    setTitle(e.target.value);
  };

  const getData = async () => {
    setIsLoading(true);
    const filter = filterOption.toLowerCase();
    // const { data } = await axios.post(
    //   `${process.env.REACT_APP_PRODUCT_TYPE_CATEGORY_}`,
    //   { userType: cat, userCategory: filter }
    // );
    setProductData(products);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [filterOption]);

  const loading = isLoading ? (
    <Container
      maxWidth="xl"
      style={{
        marginTop: 10,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingLeft: 10,
        paddingBottom: 20,
      }}
    >
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
      <Loading />
    </Container>
  ) : (
    ""
  );
  return (
    <>
      <Container
        maxWidth="xl"
        style={{
          marginTop: 90,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ minWidth: 140 }}>
          <FormControl sx={{ width: 140 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                width: "80vw",
              }}
            >
              <Button endIcon={<BiFilterAlt />}>Filters</Button>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={title}
                sx={{ width: 200 }}
                onChange={(e) => handleChange(e)}
              >
                {productFilter.map((prod) => (
                  <MenuItem key={prod} value={prod}>
                    {prod}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormControl>
        </Box>
        {loading}
        <Container
          maxWidth="xl"
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            paddingBottom: 20,
            marginBottom: 30,
            width: "100%",
          }}
        >
          {products &&
            products
              .filter((prod) => prod.productName !== "")
              .map((prod) => (
                <Link to={`/Detail/type/${cat}/${prod.id}`} key={prod.id}>
                  <ProductCard prod={prod} />
                </Link>
              ))}
        </Container>
      </Container>
      <CopyRight sx={{ mt: 8, mb: 10 }} />
    </>
  );
};

export default SingleCategory;
