import Image from ".../models/Image.js";

export const uploadSingleImage = async function (req, res) {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const new_image = new Image({
      url: req.file.path,
      public_id: req.file.filename,
    });

    await new_image.save();

    return res
      .status(201)
      .json({ message: "Image uploaded.", image: new_image });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload image.", err });
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
