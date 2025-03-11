import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
    ref: "Comment",
    default: null, // Nullable to allow top-level comments
  },
  comment_id: {
    // id of the current comment
    // Explicitly store the auto-generated _id to comment_id for readability
    type: mongoose.Schema.Types.ObjectId, // Removed `unique: true`
  },
  content: {
    // string content of the comment
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    // date when the comment is created
    type: Date,
    default: Date.now,
  },
  upvotes: {
    // current comment upvotes
    type: Number,
    default: 0,
  },
  downvotes: {
    // current comment downvotes
    type: Number,
    default: 0,
  },
  replies_count: {
    // number of replies to current comment
    type: Number,
    default: 0,
  },
});

commentSchema.pre("save", function (next) {
  if (!this.comment_id) {
    this.comment_id = this._id; // Assign _id to comment_id
  }
  next();
});

commentSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Duplicate comment ID detected."));
  } else {
    next(error);
  }
});

export default mongoose.model("Comment", commentSchema);
