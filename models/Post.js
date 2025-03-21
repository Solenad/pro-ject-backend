// TODO:
// Roe's part:
// - add proper gfs and multer for image
//Pat: adding the ids
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, //must be verified user to post */
  title: { type: String, required: true },
  deadline: {
    progress: {
      type: String,
      enum: ["Started", "In Progress", "Finished", "Deployed"],
      required: true,
    },
    deadline_length: { type: Number, required: true },
  },
  created_at: { type: Date, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
  content: { type: String, required: true },
  image: String,
  upvotes: { type: Number, default: 0, required: true },
  downvotes: { type: Number, default: 0, required: true },
  comment_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }], // change from User to Comments
});

export default mongoose.model("Post", postSchema);
