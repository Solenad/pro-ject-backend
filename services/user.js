import User from "../models/User.js";
import asyncHandler from "express-async-handler";

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
  const { id } = req.params;

  try {
    const user = await User.findById(id);
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

export const editUser = async function (req, res) {
  try {
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
};
