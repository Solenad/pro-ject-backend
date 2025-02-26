// TODO:
// - setup GFS storage for multer
// - store files in MongoDB
import multer from "multer";
// import { GridFsBucket } from "mongodb";

const storage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

export const upload = multer({ storage });
