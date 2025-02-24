// TODO:
// Roe's part:
// - add proper gfs and multer for image

import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  deadline: {
    progress: { type: String, required: true },
    deadline_length: { type: Number, required: true },
  },
  created_at: { type: Date, required: true },
  content: { type: String, required: true },
  image: { data: Buffer, imgType: String },
});

export default mongoose.model("Post", postSchema);
