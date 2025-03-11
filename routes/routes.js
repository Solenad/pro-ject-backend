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
import { userLogIn, userSignUp } from "../services/auth.js";
import { createUser, getUser, getUsers } from "../services/user.js";

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
} from "../services/comment.js";

const router = express.Router();

router.get("/test", function (req, res) {
  res.status(200).json("Hello, world!");
});

//user endpoints
router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUser);

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

// auth endpoints
router.post("/auth/login", userLogIn); // from auth to /auth/login
router.post("/auth/signup", userSignUp); // from auth to /auth/signup

// comment endpoints
// comment endpoints
router.post("/comments", addParentComment); // Add a new parent comment
router.get("/comments/:post_id", getParentComments); // Get top-level comments for a post

router.post("/comments/reply", addReplyComment); // Add a reply to a comment
router.get("/comments/replies/:comment_id", getReplyComments); // Get replies for a comment

router.put("/comments/:comment_id", editComment); // Edit a comment
router.delete("/comments/:comment_id", deleteComment); // Delete a comment

router.patch("/comments/:comment_id/upvote", upvoteComment); // Upvote a comment
router.patch("/comments/:comment_id/downvote", downvoteComment); // Downvote a comment

export default router;
