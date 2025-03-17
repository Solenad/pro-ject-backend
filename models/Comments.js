import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    user_id: {
      // id of the commenter
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post_id: {
      // id of the post where comment is posted
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    parent_comment_id: {
      // if null then parent comment, else a reply comment
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
      default: null, // Nullable to allow top-level comments
    },
    content: {
      // string content of the comment
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500, // Prevent excessively long comments
    },
    upvotes: {
      // current comment upvotes
      type: Number,
      default: 0,
      min: 0, // Prevent negative upvotes
    },
    downvotes: {
      // current comment downvotes
      type: Number,
      default: 0,
      min: 0, // Prevent negative downvotes
    },
    replies_count: {
      // number of replies to current comment
      type: Number,
      default: 0,
      min: 0, // Prevent negative reply count
    },
  },
  { timestamps: true }, // Auto-generated createdAt and updatedAt
);

export default mongoose.model("Comments", commentsSchema);
