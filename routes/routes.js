import express from "express";

const router = express.Router();

router.get("/", function (req, res) {
  res.status(200).json("Hello, world!");
});
