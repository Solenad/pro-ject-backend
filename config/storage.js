// TODO:
// - setup GFS storage for multer
// - store files in MongoDB
import multer from "multer";
import { GridFsBucket } from "mongodb";
import "dotenv/config";

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: function (req, file) {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      return {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: "images",
      };
    } else {
      return null;
    }
  },
});

export const upload = multer({ storage });
