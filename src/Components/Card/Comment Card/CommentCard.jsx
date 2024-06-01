import {
  Avatar,
  Box,
  Button,
  Grid,
  Rating,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AiFillEdit, AiFillDelete, AiOutlineSend } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { toast } from "react-toastify";
import {
  CONTRACT_AUTH_ADDRESS,
  CONTRACT_REVIEW_ADDRESS,
  shortenAddress,
} from "../../../Constants/Constant";
import { format } from "date-fns";
import { useAddress, useContract } from "@thirdweb-dev/react";

const CommentCard = ({
  userReview,
  setReviews,
  reviews,
  fetchReviews,
  loadReviews,
}) => {
  const [editComment, setEditComment] = useState(userReview.comment);
  const [edit, setEdit] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [value, setValue] = useState(userReview.rating);
  // let authToken = localStorage.getItem("Authorization");

  const { contract } = useContract(CONTRACT_AUTH_ADDRESS);
  const { contract: contractReview } = useContract(CONTRACT_REVIEW_ADDRESS);
  const address = useAddress();

  useEffect(() => {
    getUser();
  }, [address]);

  const getUser = async () => {
    // const result = await contract.call("getAdminByAddress", [address]);

    // if (result !== undefined) {
    //   setIsAdmin(true);
    // }
    setIsAdmin(false);
  };

  const handleDeleteComment = async () => {
    try {
      await contractReview.call("deleteReview", [userReview.id]);
      toast.success("Xóa bình luận thành công", {
        theme: "colored",
        autoClose: 500,
      });
      loadReviews();
      //setReviews(reviews.filter((r) => r.id !== userReview.id));
    } catch (error) {
      toast.success(error, { autoClose: 500, theme: "colored" });
    }
  };

  // const deleteCommentByAdmin = async () => {
  //   if (isAdmin) {
  //     try {
  //       const { data } = await axios.delete(
  //         `${process.env.REACT_APP_ADMIN_DELETE_REVIEW}/${userReview._id}`,
  //         {
  //           headers: {
  //             Authorization: authToken,
  //           },
  //         }
  //       );
  //       toast.success(data.msg, { autoClose: 500, theme: "colored" });
  //       setReviews(reviews.filter((r) => r._id !== userReview._id));
  //     } catch (error) {
  //       console.log(error);
  //       toast.success(error.response.data, {
  //         autoClose: 500,
  //         theme: "colored",
  //       });
  //     }
  //   } else {
  //     toast.success("Access denied", { autoClose: 500, theme: "colored" });
  //   }
  // };

  const sendEditResponse = async () => {
    if (!editComment && !value) {
      toast.error("Hãy điền bình luận", { autoClose: 500 });
    } else if (editComment.length <= 4) {
      toast.error("Bình luận phải dài từ 4 kí tự", { autoClose: 500 });
    } else if (value <= 0) {
      toast.error("Hãy thêm sao đánh giá", { autoClose: 500 });
    } else if (editComment.length >= 4 && value > 0) {
      try {
        // if (authToken) {
        //   const response = await axios.put(
        //     `${process.env.REACT_APP_EDIT_REVIEW}`,
        //     { id: userReview._id, comment: editComment, rating: value },
        //     {
        //       headers: {
        //         Authorization: authToken,
        //       },
        //     }
        //   );
        //   toast.success(response.data.msg, { autoClose: 500 });
        //   fetchReviews();
        //   setEdit(false);
        // }

        const currentTime = new Date();
        const formattedTime = format(currentTime, "dd/MM/yyyy HH:mm");
        await contractReview.call("editReview", [
          userReview.id,
          value,
          editComment,
          formattedTime,
        ]);
        toast.success("Cập nhật bình luận thành công", {
          theme: "colored",
          autoClose: 500,
        });
        loadReviews();
        //fetchReviews();
        setEdit(false);
      } catch (error) {
        toast.error("Something went wrong", { autoClose: 600 });
      }
    }
  };

  return (
    <Grid
      container
      wrap="nowrap"
      spacing={2}
      sx={{
        backgroundColor: "#1976d",
        boxShadow: "0px 8px 13px rgba(0, 0, 0, 0.2)",
        borderRadius: 5,
        margin: "20px auto",
        width: "100%",
        height: "auto",
      }}
    >
      <Grid item>
        <Avatar alt="Customer Avatar" />
      </Grid>
      <Grid justifyContent="left" item xs zeroMinWidth>
        <h4 style={{ margin: 0, textAlign: "left" }}>
          {shortenAddress(userReview?.user)}
        </h4>
        <p style={{ textAlign: "left", marginTop: 10 }}>
          {!edit && (
            <Rating
              name="read-only"
              value={userReview.rating}
              readOnly
              precision={1}
            />
          )}
          {edit && (
            <Rating
              name="simple-controlled"
              value={value}
              precision={1}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            />
          )}
        </p>
        <p
          style={{
            textAlign: "left",
            wordBreak: "break-word",
            paddingRight: 10,
            margin: "10px 0",
          }}
        >
          {!edit && userReview.comment}
        </p>
        <p>
          {edit && (
            <TextField
              id="standard-basic"
              value={editComment}
              onChange={(e) => {
                setEditComment(e.target.value);
              }}
              label="Sửa bình luận"
              multiline
              className="comment"
              variant="standard"
              sx={{ width: "90%" }}
            />
          )}
        </p>

        {edit && (
          <div
            style={{
              display: "flex",
              gap: 5,
              margin: 10,
            }}
          >
            <Button
              sx={{ width: 10, borderRadius: "30px" }}
              variant="contained"
              onClick={sendEditResponse}
            >
              {<AiOutlineSend />}{" "}
            </Button>
            <Button
              sx={{ width: 10, borderRadius: "30px" }}
              variant="contained"
              color="error"
              onClick={() => setEdit(false)}
            >
              {<GiCancel style={{ fontSize: 15, color: "white" }} />}{" "}
            </Button>
          </div>
        )}

        <p style={{ textAlign: "left", color: "gray", margin: "20px 0" }}>
          {userReview.time}
        </p>

        {/* Nếu là admin hoăc user thì có thể xóa sửa comment */}
        {(address === userReview?.user || isAdmin) && (
          <Box sx={{ height: 20, transform: "translateZ(0px)", flexGrow: 1 }}>
            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
            >
              {/* {actions.map((action) => ( */}
              <SpeedDialAction
                icon={<AiFillEdit />}
                tooltipTitle={"Sửa"}
                onClick={() => setEdit(true)}
              />
              <SpeedDialAction
                icon={<AiFillDelete />}
                tooltipTitle={"Xóa"}
                onClick={handleDeleteComment}
                // onClick={isAdmin ? deleteCommentByAdmin : handleDeleteComment}
              />
            </SpeedDial>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default CommentCard;
