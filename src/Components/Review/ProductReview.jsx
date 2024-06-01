import React, { useEffect, useState } from "react";
import axios from "axios";
import Rating from "@mui/material/Rating";
import {
  MdSentimentSatisfiedAlt,
  MdSentimentDissatisfied,
  MdSentimentVeryDissatisfied,
  MdSentimentNeutral,
  MdSentimentVerySatisfied,
  MdStarRate,
  MdOutlineSentimentVeryDissatisfied,
  MdSend,
  MdOutlineFilterAlt,
} from "react-icons/md";
import Box from "@mui/material/Box";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import "./Review.css";
import CommentCard from "../Card/Comment Card/CommentCard";
import { customerReview } from "../../Assets/Images/Image";
import { CONTRACT_REVIEW_ADDRESS, getReviews } from "../../Constants/Constant";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { format } from "date-fns";

const labels = {
  0: <MdOutlineSentimentVeryDissatisfied style={{ color: "red" }} />,
  0.5: <MdOutlineSentimentVeryDissatisfied style={{ color: "red" }} />,
  1: <MdSentimentVeryDissatisfied style={{ color: "red" }} />,
  1.5: <MdSentimentVeryDissatisfied style={{ color: "red" }} />,
  2: <MdSentimentDissatisfied style={{ color: "orange" }} />,
  2.5: <MdSentimentDissatisfied style={{ color: "orange" }} />,
  3: <MdSentimentNeutral style={{ color: "gold" }} />,
  3.5: <MdSentimentNeutral style={{ color: "gold" }} />,
  4: <MdSentimentSatisfiedAlt style={{ color: "green" }} />,
  4.5: <MdSentimentSatisfiedAlt style={{ color: "green" }} />,
  5: <MdSentimentVerySatisfied style={{ color: "green" }} />,
};

const ProductReview = ({ authToken, setProceed, setOpenAlert, id }) => {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState("");
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [filterOption, setFilterOption] = useState("Tất cả");
  const [title, setTitle] = useState("Tất cả");
  const { contract } = useContract(CONTRACT_REVIEW_ADDRESS);

  const address = useAddress();
  const commentFilter = ["Tất cả"];

  useEffect(() => {
    loadReviewsByProductId();
  }, []);

  useEffect(() => {
    loadReviewsByProductId();
  }, [reviews]);

  // useEffect(() => {
  //   //fetchReviews();
  //   loadReviewsByProductId();
  // }, [title, id]);

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  }

  async function loadReviewsByProductId() {
    const data = await contract.call("getReviewsByProductId", id);
    setReviews(data);
    // getReviews(setReviews, id);
  }

  const handleChange = (e) => {
    setFilterOption(e.target.value.split(" ").join("").toLowerCase());
    setTitle(e.target.value);
    fetchReviews();
  };

  const fetchReviews = async () => {
    const filter = filterOption.toLowerCase();
    const { data } = await axios.post(
      `${process.env.REACT_APP_GET_REVIEW}/${id}`,
      { filterType: filter }
    );
    setReviews(data);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment && !value) {
      toast.error("Hãy điền bình luận", {
        theme: "colored",
        autoClose: 500,
      });
    } else if (comment.length <= 4) {
      toast.error("Bình luận phải dài từ 4 kí tự", {
        theme: "colored",
        autoClose: 500,
      });
    } else if (value <= 0) {
      toast.error("Hãy thêm sao đánh giá", {
        theme: "colored",
        autoClose: 500,
      });
    } else if (comment.length >= 4 && value > 0) {
      try {
        if (setProceed) {
          const currentTime = new Date();
          const formattedTime = format(currentTime, "dd/MM/yyyy HH:mm");
          await contract.call("addReview", [
            address,
            id,
            value,
            comment,
            formattedTime,
          ]);
          toast.success("Bình luận thành công", {
            theme: "colored",
            autoClose: 500,
          });
        } else {
          setOpenAlert(true);
        }
        setComment("");
        setValue(null);
      } catch (error) {
        toast.error(error.response.data.msg, {
          theme: "colored",
          autoClose: 600,
        });
        setComment("");
        setValue("");
      }
    }
  };
  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmitReview} className="form">
          <Box
            sx={{
              width: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Rating
              name="hover-feedback"
              value={value}
              precision={1}
              getLabelText={getLabelText}
              id="rating"
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <MdStarRate style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
            {value !== null && (
              <Box className="expression-icon" sx={{ ml: 2 }}>
                {labels[hover !== -1 ? hover : value]}
              </Box>
            )}
          </Box>
          <TextField
            id="filled-textarea"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            label="Bình luận"
            placeholder="Bình luận của bạn?"
            multiline
            className="comment"
            variant="outlined"
          />

          <Tooltip title="Gửi đánh giá">
            <Button
              className="form-btn"
              variant="contained"
              type="submit"
              endIcon={<MdSend />}
            >
              Gửi
            </Button>
          </Tooltip>
        </form>

        <div className="form-img-box">
          <img
            src={customerReview}
            loading="lazy"
            alt="Customer Review"
            className="review-img"
          />
        </div>
      </div>

      {reviews && reviews.length >= 1 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            width: "80vw",
          }}
        >
          <Button endIcon={<MdOutlineFilterAlt />}>Filters</Button>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={title}
            sx={{ width: 200 }}
            onChange={(e) => handleChange(e)}
          >
            {/* Hiển thị filter */}
            {commentFilter.map((prod, index) => (
              <MenuItem key={index} value={prod}>
                {prod}
              </MenuItem>
            ))}
          </Select>
        </Box>
      ) : (
        <Typography sx={{ textAlign: "center" }}>
          Hiện tại đang chưa có bình luận nào. Bạn hãy trở thành người bình luận
          đầu tiên!
        </Typography>
      )}
      {/* Hiển thị bình luận */}
      <Box className="review-box">
        {reviews.map(
          (review) =>
            review.time !== "" && (
              <CommentCard
                userReview={review}
                key={review.id}
                authToken={authToken}
                setReviews={setReviews}
                reviews={reviews}
                fetchReviews={fetchReviews}
                loadReviews={loadReviewsByProductId}
              />
            )
        )}
      </Box>
    </>
  );
};

export default ProductReview;
