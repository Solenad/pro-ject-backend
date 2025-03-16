import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  type: {
    type: String,
    enum: ["up", "down"],
    required: true,
  },
});

export default mongoose.model("Like", likeSchema);
