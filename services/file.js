import { storage } from "../config/storage.js";

export const uploadSingleFile = async function (req, res) {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
  }
};
