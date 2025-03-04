import asyncHandler from "express-async-handler"; // no need for try-catch
import Auth from "../models/Auth.js";

export const userLogIn = asyncHandler(async (req, res) => {
  console.log("Body Content: ", req.body); // for debugging

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields must be filled.");
  }

  const user = await Auth.findOne({ email });

  if (!user || user.password !== password) {
    res.status(401);
    throw new Error("Invalid credentials.");
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      email: user.email,
      username: user.username,
    },
  });
});

export const userSignUp = asyncHandler(async (req, res) => {
  console.log("Body Content: ", req.body); // for debugging

  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(400);
    throw new Error("All fields must be filled.");
  }

  // Check if email already exists
  const emailExists = await Auth.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email is already in use.");
  }

  // Check if username already exists
  const usernameExists = await Auth.findOne({ username });
  if (usernameExists) {
    res.status(400);
    throw new Error("Username is already taken.");
  }

  const newUser = await Auth.create({ email, password, username });

  res.status(201).json({
    message: "Signup successful",
    user: {
      email: newUser.email,
      password: newUser.password,
      username: newUser.username,
    },
  });
});
