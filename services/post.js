// TODO:
// Endpoints planned:
// - GET: /posts
import Post from "../models/Post.js";

export const createPost = async function (req, res) {
  try {
    const { title, deadline, created_at, content, image } = req.body;

    const new_post = new Post({
      title: title,
      deadline: deadline,
      created_at: created_at,
      content: content,
      image: image || null,
    });

    const saved_post = await new_post.save();

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
          return res.status(404).json({ message: "No posts found for the specified user." });
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
