import User from "../models/User.js";
import asyncHandler from "express-async-handler";

export const userSignUp = asyncHandler(async (req, res) => {
  const { user_email, user_password, user_name, user_tag } = req.body;

  if (!user_email || !user_password || !user_name || !user_tag) {
    res.status(400).json({ message: "All fields must be filled." });
    return;
  }

  const emailExists = await User.findOne({ user_email });
  if (emailExists) {
    res.status(400).json({ message: "Email is already in use." });
    throw new Error("Email is already in use.");
  }

  const usertagExists = await User.findOne({ user_tag });
  if (usertagExists) {
    res.status(400).json({ message: "Usertag is already taken." });
    throw new Error("Usertag is already taken.");
  }

  const newUser = await User.create({ user_email, user_password, user_name, user_tag });

  // NOTE: password is included for testing (temporary)
  res.status(201).json({
    message: "Signup successful",
    user: {
      email: newUser.user_email,
      username: newUser.user_name,
      usertag: newUser.user_tag,
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
    res.status(401).json({ message: "Invalid email or password!" });
    throw new Error("Invalid email or password!");
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

// get all users
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

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deletion successful",
      user: {
        email: user.user_email,
        username: user.user_name,
        id: user._id,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

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

export const editUser = async function (req,res) {
  try{
    const { id } = req.params;
    const newData = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User is not found." });
    }

    const edited_user = await User.findByIdAndUpdate(id, newData, {
          new: true,
        });
    
    res.status(200).json({ message: "User edited.", edited_post });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error editing user.", error: error.message });
  }
}
