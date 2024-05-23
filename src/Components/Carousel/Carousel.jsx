import React from "react";
import AliceCarousel from "react-alice-carousel";
//import BannerData from "../../Helpers/HomePageBanner";
import "react-alice-carousel/lib/alice-carousel.css";
import { Link } from "react-router-dom";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { CONTRACT_CATEGORY_ADDRESS } from "../../Constants/Constant";

const Carousel = () => {
  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3, itemsFit: "contain" },
  };

  const { contract } = useContract(CONTRACT_CATEGORY_ADDRESS);
  const { data } = useContractRead(contract, "getAllCategories");

  const items =
    data &&
    data.map((item) => (
      <Link
        to={`product/type/${item.categoryName.toLowerCase()}/${item.id}`}
        key={item.id}
      >
        <div className="item" style={{ marginTop: 10 }}>
          <img
            src={item.logo}
            loading="lazy"
            alt={item.categoryName}
            style={{ height: "300px", width: "100%", objectFit: "contain" }}
          />
        </div>
      </Link>
    ));

  return (
    <AliceCarousel
      animationType="fadeout"
      animationDuration={800}
      disableButtonsControls
      infinite
      items={items}
      touchTracking
      mouseTracking
      disableDotsControls
      autoPlay
      autoPlayInterval={2500}
      responsive={responsive}
    />
  );
};

export default Carousel;
