import Image from "../models/Image.js";
import cloudinary from "../middleware/storage.js";
import "dotenv/config";

/**
 * POST "/upload"
 * @async
 * @function uploadSingleImage()
 */
export const uploadSingleImage = async function (req, res) {
  const file_name = req.file.originalname.split(".")[0];
  const date = new Date(Date.now())
    .toLocaleDateString("en-US", {
      timeZone: "Asia/Singapore",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    folder: "images",
    public_id: `${file_name}_${date}`,
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
        }
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
