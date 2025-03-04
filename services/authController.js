const asyncHandler = require("express-async-handler"); // no need for try catch block
const Auth = require("../models/Auth");

const userLogIn = asyncHandler(async (req, res) => {
  console.log("Body Content: ", req.body); // Debugging log

  const { email, password } = req.body;

  // if any of the field is empty
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields must be filled.");
  }

  const user = await Auth.findOne({ email });

  if (!user || user.password !== password) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      email: user.email,
      username: user.username,
    },
  });
});

const signUp = (module.exports = { userLogIn });
