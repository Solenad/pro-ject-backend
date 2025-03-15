//Pat's part

import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  user_name: { type: String, required: true },
  user_tag: { type: String, required: true },
  user_bio: { type: String, required: false },
  is_admin: { type: Boolean, required: true },
  post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  shared_post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  upvoted_post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  downvoted_post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comment_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

export default mongoose.model("User", userSchema);
