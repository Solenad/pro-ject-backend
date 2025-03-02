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
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async function (req, res) {
  const posts = await Post.find({});

  if (!posts) {
    return res
      .status(404)
      .json({ message: "Pro-Ject currently has no posts to display." });
  }

  res.status(200).json(posts);
};
