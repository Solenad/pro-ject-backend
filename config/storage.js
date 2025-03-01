// TODO:
// - setup GFS storage for multer
// - store files in MongoDB
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUD_API_KEY;
const api_secret = process.env.CLOUD_API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
    format: async (req, file) => "png",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

export const parser = multer({ storage: storage });
