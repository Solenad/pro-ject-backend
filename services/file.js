import Image from "../models/Image.js";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Cloudinary config
const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUD_API_KEY;
const api_secret = process.env.CLOUD_API_SECRET;

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

/**
 * POST "/upload"
 * @async
 * @function uploadSingleImage()
 */
export const uploadSingleImage = async function (req, res) {
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    folder: "images",
  };

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const upload_result = await new Promise(function (resolve, reject) {
      const upload_stream = cloudinary.uploader.upload_stream(
        options,
        function (err, upload_result) {
          if (err) {
            console.error("Error: " + err);
            reject(err);
          } else {
            resolve(upload_result);
          }
        },
      );
      upload_stream.end(req.file.buffer);
    });

    const new_image = new Image({
      url: upload_result.secure_url,
      public_id: upload_result.public_id,
    });

    await new_image.save();

    return res
      .status(201)
      .json({ message: "Image uploaded.", image: new_image });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to upload image.", error: err.message });
  }
};

export const getImage = async function (req, res) {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    return res.status(200).json({ image_url: image.url });
  } catch (err) {
    res.status(500).json({ message: "Error getting image.", err });
  }
};
