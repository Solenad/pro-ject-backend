import express from "express";
import { createPost, getPosts } from "../services/post.js";

const router = express.Router();

router.get("/test", function (req, res) {
  res.status(200).json("Hello, world!");
});

// posts endpoints
router.post("/", createPost);
router.get("/", getPosts);

export default router;
