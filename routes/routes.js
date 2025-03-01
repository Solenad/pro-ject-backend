import express from "express";
import { upload } from "../config/storage.js";
import { createPost, getPosts } from "../services/post.js";
import { uploadSingleImage } from "../services/file.js";

const router = express.Router();

router.get("/test", function (req, res) {
  res.status(200).json("Hello, world!");
});

// posts endpoints
router.post("/", createPost);
router.get("/", getPosts);

// file endpoints
router.post("/upload", upload.single("image"), uploadSingleImage);

export default router;
