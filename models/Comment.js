import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user_id: {
      // id of the commenter
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Faster lookups for user-specific comments
    },
    post_id: {
      // id of the post where comment is posted
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true, // Index for quick retrieval of post comments
    },
    parent_comment_id: {
      // if null then parent comment, else a reply comment
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // Nullable to allow top-level comments
      index: true, // Faster lookup for nested replies
    },
    content: {
      // string content of the comment
      type: String,
      required: true,
      trim: true,
      minlength: 1, // Minimum length of 1 character
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
  { timestamps: true } // Auto-generated createdAt and updatedAt
);

// Better error handling for duplicate keys and validation errors
commentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Duplicate comment detected."));
  } else if (error.name === "ValidationError") {
    next(new Error(`Validation error: ${error.message}`));
  } else if (error.name === "CastError") {
    next(new Error(`Invalid data type: ${error.message}`));
  } else {
    next(error);
  }
});

commentSchema.statics.updateField = async function (commentId, field, value) {
  if (!["upvotes", "downvotes", "replies_count"].includes(field)) {
    throw new Error(`Invalid field: ${field}`);
  }

  await this.findByIdAndUpdate(commentId, { $inc: { [field]: value } });
};

export default mongoose.model("Comment", commentSchema);
