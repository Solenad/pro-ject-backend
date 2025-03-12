import express from "express";
import { upload } from "../middleware/storage.js";
import {
  createPost,
  getPosts,
  getPost,
  editPost,
  deletePost,
} from "../services/post.js";
import {
  uploadSingleImage,
  getImageById,
  deleteImageById,
} from "../services/file.js";
// import { userLogIn, userSignUp } from "../services/auth.js";
import {
  userSignUp,
  userLogIn,
  deleteUser,
  getUser,
  getUsers,
} from "../services/user.js";

// set endpoints for comment functions
import {
  addParentComment,
  getParentComments,
  addReplyComment,
  getReplyComments,
  editComment,
  deleteComment,
  upvoteComment,
  downvoteComment,
  getAllComments,
  getAllNumComments,
} from "../services/comment.js";

const router = express.Router();

router.get("/test", function (req, res) {
  res.status(200).json("Hello, world!");
});

//user endpoints
router.post("/user/signup", userSignUp); // from createUser (user) to userSignUp (transfered from auth)
router.post("/user/login", userLogIn); // from auth as well
router.get("/users", getUsers); // get all users
router.get("/users/:id", getUser);
router.delete("/user/delete/:id", deleteUser);

// posts endpoints
router.post("/post", createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.put("/:id", editPost);
router.delete("/:id", deletePost);

// file endpoints
router.post("/upload", upload.single("image"), uploadSingleImage);
router.get("/image/:id", getImageById);
router.delete("/image/:id", deleteImageById);

// Comment endpoints
router.get("/comments", getAllComments); // View all comments

router.post("/comments/add", addParentComment); // Add a new parent comment
router.get("/comments/post/:post_id", getParentComments); // Get top-level comments for a post
router.get("/comment-num/:post_id",getAllNumComments); //Get num comments

router.post("/comments/reply", addReplyComment); // Add a reply to a comment
router.get("/comments/replies/:comment_id", getReplyComments); // Get replies for a comment

router.put("/comment/:comment_id", editComment); // Edit a comment
router.delete("comment/delete/:comment_id", deleteComment); // Delete a comment

router.patch("/upvote/:comment_id", upvoteComment); // Upvote a comment
router.patch("/downvote/:comment_id", downvoteComment); // Downvote a comment

export default router;
