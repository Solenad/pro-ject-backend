import express from "express";
import { upload } from "../middleware/storage.js";
import { createPost, getPosts } from "../services/post.js";
import { uploadSingleImage, getImage } from "../services/file.js";

import { userLogIn, userSignUp } from "../services/authController.js"; // Adjust path if needed

const router = express.Router();

router.get("/test", function (req, res) {
  res.status(200).json("Hello, world!");
});

// posts endpoints
router.post("/", createPost);
router.get("/", getPosts);

// file endpoints
router.post("/upload", upload.single("image"), uploadSingleImage);
router.get("/image/:id", getImage);

// auth endpoints
router.post("/login", userLogIn);
router.post("/signup", userSignUp);

export default router;
