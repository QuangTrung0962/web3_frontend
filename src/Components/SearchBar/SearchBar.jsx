import {
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import {
  CONTRACT_PRODUCT_ADDRESS,
  getAllProducts,
} from "../../Constants/Constant";
import { useContract, useContractRead } from "@thirdweb-dev/react";
const SearchBar = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { contract } = useContract(CONTRACT_PRODUCT_ADDRESS);
  const { data: productData, isLoading } = useContractRead(
    contract,
    "getAllProducts"
  );

  useEffect(() => {
    //getAllProducts(setData);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const newFilteredData = productData.filter(
      (item) =>
        item.productName &&
        item.productName
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      //   ||
      // (item.type &&
      //   item.type.toLowerCase().includes(event.target.value.toLowerCase())) ||
    );
    setFilteredData(newFilteredData);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: 5,
      }}
    >
      <TextField
        id="search"
        type="search"
        label="Tìm kiếm"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ width: { xs: 350, sm: 500, md: 800 } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <AiOutlineSearch />
            </InputAdornment>
          ),
        }}
      />
      {searchTerm.length > 0 && (
        <Box
          sx={{
            width: { xs: 350, sm: 500, md: 800 },
            overflowY: "scroll",
            height: "200px",
          }}
        >
          <Stack spacing={0}>
            {filteredData.length === 0 ? (
              <Typography variant="h6" textAlign="center" margin="25px 0">
                Không tìm thấy sản phẩm
              </Typography>
            ) : (
              filteredData.map((products) => (
                <Link to={`/product/${products.id}`} key={products.id}>
                  <Item
                    sx={{
                      borderRadius: 0,
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "2px 15px",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      {products.productName.slice(0, 35)}
                    </Typography>
                    <img
                      src={products.images[0]}
                      alt={products.productName}
                      style={{ width: 80, height: 70 }}
                    />
                  </Item>
                </Link>
              ))
            )}
          </Stack>
        </Box>
      )}
    </Container>
  );
};

export default SearchBar;
