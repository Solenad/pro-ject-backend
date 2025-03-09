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
router.post("/auth", userLogIn);
router.post("/auth", userSignUp);



export default router;
