//Pat's part

import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    user_email: { type: String, required: true },
    user_password: { type: String, required: true },
    user_name: { type: String, required: true },
    user_tag: { type: String, required: true },
    user_bio: { type: String, required: false, default: "Enter bio" },
    is_admin: { type: Boolean, required: false, default: false },
    post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    shared_post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    upvoted_post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    downvoted_post_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    following_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comment_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
  },
  {
    timestamps: true, // record when signing up
  },
);

export default mongoose.model("User", userSchema);
