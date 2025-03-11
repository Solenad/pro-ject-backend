import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// from recent auth
export const userSignUp = asyncHandler(async (req, res) => {
  const { user_email, user_password, user_name } = req.body;

  if (!user_email || !user_password || !user_name) {
    res.status(400).json({ message: "All fields must be filled." });
    return;
  }

  // Check if email already exists
  const emailExists = await User.findOne({ user_email });
  if (emailExists) {
    res.status(400).json({ message: "Email is already in use." });
    throw new Error("Email is already in use.");
  }

  // Check if username already exists
  const usernameExists = await User.findOne({ user_name });
  if (usernameExists) {
    res.status(400).json({ message: "Username is already taken." });
    throw new Error("Username is already taken.");
  }

  const newUser = await User.create({ user_email, user_password, user_name });

  // password is included for testing
  res.status(201).json({
    message: "Signup successful",
    user: {
      email: newUser.user_email,
      username: newUser.user_name,
      password: newUser.user_password,
      _id: newUser._id,
      createdAt: newUser.createdAt,
    },
  });
});

// from recent auth
export const userLogIn = asyncHandler(async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    res.status(400).json({ message: "All fields must be filled." });
    throw new Error("All fields must be filled.");
  }

  const user = await User.findOne({ user_email });

  if (!user || user.user_password !== user_password) {
    res.status(401).json({ message: "Invalid email or password !!" });
    return;
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      email: user.user_email,
      username: user.user_name,
      _id: user._id,
    },
  });
});

/*
export const createUser = async function (req, res) {
  try {
    const { user_name, user_tag, user_bio, is_admin } = req.body;

    const newUser = new User({
      user_name,
      user_tag,
      user_bio,
      is_admin,
    });

    await newUser.save();
    res.status(201).json({
      message: "User created",
      user: {
        email: newUser.email,
        password: newUser.password,
        username: newUser.username,
        _id: newUser._id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
*/

export const getUsers = async function (req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const getUser = async function (req, res) {
  try {
    console.log("Fetching user with ID:", req.params.id); // Debugging line

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user_id: user._id,
      user_name: user.user_name,
      user_tag: user.user_tag,
      user_bio: user.user_bio,
      is_admin: user.is_admin,
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res
      .status(500)
      .json({ message: "Error getting user.", error: error.message });
  }
};
