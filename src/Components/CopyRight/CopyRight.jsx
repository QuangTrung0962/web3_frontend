import { Typography } from "@mui/material";
import React from "react";

const CopyRight = (props) => {
  return (
    <div href="/" target="_blank" rel="noreferrer">
      <Typography
        variant="body1"
        fontWeight="bold"
        color="text.secondary"
        align="center"
        {...props}
        style={{ color: "#1976d2" }}
      >
        {" "}
        {new Date().getFullYear()}
        {/* {'.'} */}
        {" © "}
        Phát triển bởi Quang Trung
      </Typography>
    </div>
  );
};

export default CopyRight;
