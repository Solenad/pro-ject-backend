// TODO:
// Endpoints planned:
// - GET: /posts
import Post from "../models/Post.js";

export const createPost = async function (req, res) {
  try {
    const { title, deadline, created_at, content } = req.body;

    const new_post = new Post({
      title: title,
      deadline: deadline,
      created_at: created_at,
      content: content,
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

  const posts = await Post.find({}).skip(page * postsPerPage).limit(postsPerPage);

  if (!posts) {
    return res
      .status(404)
      .json({ message: "Pro-Ject currently has no posts to display." });
  }

  res.status(200).json(posts);
};

export const getPost = async function (req, res) {
  try {
    const { post_id } = req.params;
    const post = Post.find(post_id);

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
    const { post_id } = req.params;

    const post = await Post.find(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post is not found." });
    }

    const edited_post = await Post.findByIdAndUpdate(post_id);

    res.status(200).json({ message: "Post edited.", edited_post });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error editing post.", error: err.message });
  }
};

export const deletePost = async function (req, res) {
  try {
    const { post_id } = req.params;

    const post = await Post.find(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post is not found." });
    }

    await Post.findByIdAndDelete(post_id);

    if (await Post.find(post_id))
      res.status(200).json({ message: "Post edited.", edited_post });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error editing post.", error: err.message });
  }
};
