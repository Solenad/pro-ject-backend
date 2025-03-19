// TODO:
// Endpoints planned:
// - GET: /posts
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import User from "../models/User.js";
import Comments from "../models/Comment.js";

export const createPost = async function (req, res) {
  try {
    const { user_id, title, deadline, created_at, content, image } = req.body;

    const new_post = new Post({
      author_id: user_id.userId,
      title: title,
      deadline: deadline,
      created_at: created_at,
      content: content,
      image: image || null,
    });

    const saved_post = await new_post.save();

    const user = await User.findById(saved_post.author_id);
    user.post_ids.push(saved_post._id);
    await user.save();

    res.status(201).json(saved_post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getPosts = async function (req, res) {
  const page = req.query.p || 0;
  const postsPerPage = 5;

  const posts = await Post.find({})
    .populate("author_id", "user_name")
    .skip(page * postsPerPage)
    .limit(postsPerPage);

  if (!posts) {
    return res
      .status(404)
      .json({ message: "Pro-Ject currently has no posts to display." });
  }

  const total_posts = await Post.countDocuments();
  const total_pages = Math.ceil(total_posts / 5);

  res.status(200).json({ posts, total_pages, current_page: page });
};

export const getPost = async function (req, res) {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res
        .status(404)
        .json({ message: "Pro-Ject currently has no posts to display." });
    }

    return res.status(200).json(post);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting post.", error: err.message });
  }
};

export const editPost = async function (req, res) {
  try {
    const { id } = req.params;
    const newData = req.body;

    const post = await Post.findById(id);
    //for debug

    if (!post) {
      return res.status(404).json({ message: "Post is not found." });
    }

    const edited_post = await Post.findByIdAndUpdate(id, newData, {
      new: true,
    });

    res.status(200).json({ message: "Post edited.", edited_post });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error editing post.", error: err.message });
  }
};

export const deletePost = async function (req, res) {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post is not found." });
    }

    if (Array.isArray(post.comment_ids)) {
      await Comments.updateMany(
        { _id: { $in: post.comment_ids } },
        { $unset: { post_id: "" } },
      );
    } else {
      await Comments.findByIdAndUpdate(post.comment_id, {
        $unset: { post_id: "" },
      });
    }

    await User.findByIdAndUpdate(post.user_id, {
      $pull: { post_ids: id },
    });

    await Post.findByIdAndDelete(id);

    return res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting post.", error: err.message });
  }
};

export const getPostsByUser = async function (req, res) {
  try {
    const page = Number(req.query.p) || 0;
    const postsPerPage = 5;
    const userId = req.query.userId; // Get userId from query parameters

    // Build the query object
    const query = userId ? { userId } : {};

    // Get filtered and paginated posts
    const posts = await Post.find(query)
      .skip(page * postsPerPage)
      .limit(postsPerPage);

    // Check if posts were found
    if (!posts || posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for the specified user." });
    }

    // Count total filtered posts for pagination
    const total_posts = await Post.countDocuments(query);
    const total_pages = Math.ceil(total_posts / postsPerPage);

    // Send response with filtered posts and pagination info
    res.status(200).json({ posts, total_pages, current_page: page });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error while fetching posts." });
  }
};

export const votePost = async function (req, res) {
  try {
    const { id } = req.params;
    const { type, user_id } = req.body;
    const post = await Post.findById(id);

    const already_liked = await Like.findOne({
      post_id: post.id,
      user_id: user_id,
    });

    let upd_post;

    if (!already_liked) {
      await Like.create({ post_id: id, user_id, type });

      upd_post = await Post.findByIdAndUpdate(
        id,
        { $inc: { [type == "up" ? "upvotes" : "downvotes"]: 1 } },
        { new: true },
      );
    } else if (type == already_liked.type) {
      await Like.deleteOne({ _id: already_liked._id });

      upd_post = await Post.findByIdAndUpdate(
        id,
        { $inc: { [type === "up" ? "upvotes" : "downvotes"]: -1 } },
        { new: true },
      );
    } else {
      await Like.findByIdAndUpdate(already_liked._id, { type });

      upd_post = await Post.findByIdAndUpdate(
        id,
        {
          $inc: {
            upvotes: type == "up" ? 1 : type == "down" ? -1 : 0,
            downvotes: type == "down" ? 1 : type == "up" ? -1 : 0,
          },
        },
        { new: true },
      );
    }

    if (!upd_post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(upd_post);
  } catch (err) {
    console.log("Error: " + err.message);
    return res.status(500).json({
      message: "Error upvoting/downvoting post",
      error: err.message,
    });
  }
};

export const getUpvotesByUser = async function (req, res) {
  const { id } = req.params;

  try {
    // Find all likes of type "up" by the user and populate the post data
    const likes = await Like.find({ user_id: id, type: "up" }).populate({
      path: "post_id",
      populate: {
        path: "author_id",
        select: "username profilePicture",
      },
    });

    console.log(likes);

    // Extract the posts from the likes
    const upvotedPosts = likes.map((like) => like.post_id);

    res.status(200).json({ posts: upvotedPosts });
  } catch (error) {
    console.error("Error fetching upvoted posts:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching upvoted posts." });
  }
};

export const getDownvotesByUser = async function (req, res) {
  const { id } = req.params;

  try {
    // Find all likes of type "up" by the user and populate the post data
    const likes = await Like.find({ user_id: id, type: "down" }).populate({
      path: "post_id",
      populate: {
        path: "author_id",
        select: "username profilePicture",
      },
    });

    // Extract the posts from the likes
    const downvotedPosts = likes.map((like) => like.post_id);

    res.status(200).json({ posts: downvotedPosts });
  } catch (error) {
    console.error("Error fetching downvoted posts:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching downvoted posts." });
  }
};
