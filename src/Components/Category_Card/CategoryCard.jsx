import React from "react";
import styles from "./Category.module.css";
import { Link } from "react-router-dom";

const CategoryCard = ({ data }) => {
  if (data !== undefined) {
    return (
      <Link to={`product/${data?.id}`}>
        <div
          className={styles.mainCard}
          style={{ height: "300px", width: "300px" }}
        >
          <img
            style={{ objectFit: "contain" }}
            src={data.images[0]}
            alt=""
            className={styles.mainImg}
            loading="lazy"
          />
          {/* <span className={styles.imgTitle}>{data.name}</span> */}
        </div>
      </Link>
    );
  }
};

export default CategoryCard;
