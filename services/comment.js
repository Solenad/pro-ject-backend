import asyncHandler from "express-async-handler"; // no need for try-catch
import Comments from "../models/Comments.js";
import Post from "../models/Post.js";

// Drop the index
(async () => {
  try {
    await Comments.collection.dropIndex("comment_id_1");
    console.log("Index dropped successfully");
  } catch (err) {
    if (err.codeName !== "IndexNotFound") {
      console.error("Error dropping index:", err.message);
    }
  }
})();

// comment on a post
export const addParentComment = asyncHandler(async (req, res) => {
  const { user_id, post_id, content } = req.body;

  if (!user_id || !post_id || !content) {
    return res.status(400).json({ message: "All fields are required." }); // for testing
  }

  const newComment = new Comments({
    user_id,
    post_id,
    content,
  });

  await newComment.save();

  res.status(201).json({
    message: "Comment added successfully",
    comment: newComment,
  });
});

// fetch top-level comments for a post
export const getParentComments = asyncHandler(async (req, res) => {
  const { post_id } = req.params;

  if (!post_id) {
    return res.status(400).json({ message: "Post ID is required" });
  }

  const comments = await Comments.find({ post_id, parent_comment_id: null })
    .sort({ created_at: -1 }) // newest to oldest
    .populate("user_id", "user_name") // user details
    .lean();

  res.status(200).json(comments);
});

// reply to a comment
export const addReplyComment = asyncHandler(async (req, res) => {
  const { user_id, post_id, parent_comment_id, content } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(post_id) ||
    !mongoose.Types.ObjectId.isValid(parent_comment_id)
  ) {
    return res.status(400).json({ message: "Invalid post or comment ID" });
  }

  const parentComment = await Comments.findById(parent_comment_id);
  if (!parentComment) {
    return res.status(404).json({ message: "Parent comment not found" });
  }

  const reply = new Comments({
    user_id,
    post_id,
    parent_comment_id,
    content,
  });

  await reply.save();

  await Comments.findByIdAndUpdate(parent_comment_id, {
    $inc: { replies_count: 1 },
  });

  res.status(201).json({ message: "Reply added successfully", reply });
});

// get the replies to the parent comment
export const getReplyComments = asyncHandler(async (req, res) => {
  try {
    const { comment_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(comment_id)) {
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    // Find replies where parent_comment_id matches the given comment_id
    const replies = await Comments.find({ parent_comment_id: comment_id })
      .populate("user_id", "username") // Fetch username of commenter
      .sort({ created_at: 1 });

    // Return the response
    res.status(200).json({
      replies,
      message: replies.length ? "Replies found" : "No replies yet",
    }); // for testing
  } catch (error) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// edit a comment by id
export const editComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.params; // change to body (depends)
  const { user_id, content } = req.body;

  const comment = await Comments.findById(comment_id);

  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  if (comment.user_id.toString() !== user_id) {
    return res
      .status(403)
      .json({ message: "Unauthorized to edit this comment" });
  }

  comment.content = content;
  await comment.save();

  res.status(200).json({ message: "Comment updated successfully", comment });
});

// delete a comment by id permanently
export const deleteComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.params;

  console.log("Received DELETE request for comment ID:", comment_id);

  if (!comment_id) {
    return res.status(400).json({ message: "Comment ID is required" });
  }

  const comment = await Comments.findById(comment_id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  await Post.findByIdAndUpdate(comment.post_id, {
    $pull: { comment_ids: comment_id },
  });

  await User.findByIdAndUpdate(comment.user_id, {
    $pull: { comment_ids: comment_id },
  });

  await Comments.findByIdAndDelete(comment_id);

  res.status(200).json({ message: "Comment deleted successfully" });
});

// increment comment upvote
export const upvoteComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.params;

  // Find the comment by ID and increment upvotes
  const updatedComment = await Comments.findByIdAndUpdate(
    comment_id,
    { $inc: { upvotes: 1 } }, // Increment upvotes by 1
    { new: true }
  );

  if (!updatedComment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  res
    .status(200)
    .json({ message: "Upvoted successfully", comment: updatedComment }); // for testing
});

// increment comment downvote
export const downvoteComment = asyncHandler(async (req, res) => {
  const { comment_id } = req.params;

  // Find the comment by ID and increment downvotes
  const updatedComment = await Comments.findByIdAndUpdate(
    comment_id,
    { $inc: { downvotes: 1 } }, // Increment downvotes by 1
    { new: true }
  );

  if (!updatedComment) {
    return res.status(404).json({ message: "Comment not found" });
  }

  res
    .status(200)
    .json({ message: "Downvoted successfully", comment: updatedComment }); // for testing
});

// view all comments in all post
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comments.find().populate("user_id", "user_name"); // Add user details;

    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to retrieve comments" });
  }
};

export const getAllNumComments = async (req, res) => {
  const { post_id } = req.params;

  try {
    const comments = await Comments.find({ post_id, parent_comment_id: null }).countDocuments(); 
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to retrieve comments" });
  }
};
