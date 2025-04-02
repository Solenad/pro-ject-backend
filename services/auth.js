import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

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

  const newUser = await User.create({
    user_email,
    user_password,
    user_name,
    user_tag,
  });

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

  // Regenerate session ID for security
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ message: "Session regeneration failed" });
    }

    console.log("Session ID after regeneration:", req.session.id); // Debugging line
    // Store user data in session
    req.session.user = {
      email: user.user_email,
      username: user.user_name,
      _id: user._id,
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user, // Sends back session-stored user info
      session_id: req.session.id, // Sends back session ID for debugging
    });
  });
});

export async function getAllSessions() {
  try {
    // Access the session collection in MongoDB
    const sessionCollection = mongoose.connection.collection("sessions");

    // Fetch all session documents
    const sessions = await sessionCollection.find({}).toArray();

    // If no sessions found
    if (sessions.length === 0) {
      console.log("No sessions found.");
    } else {
      console.log(`Fetched ${sessions.length} session(s):`);
      sessions.forEach((session, index) => {
        console.log(`Session ${index + 1}:`, session);
      });
    }

    return sessions;
  } catch (error) {
    console.error("Error fetching sessions:", error.message);
    throw error; // You can handle this further based on your needs
  }
}
