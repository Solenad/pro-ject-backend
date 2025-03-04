// Andrei's Part

import mongoose from "mongoose";

// LOGIN => email and password
// SIGNUP => all fields
// *implement auto-assigned user_id for each new user created
const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // record when signing up
  }
);

export default mongoose.model("Auth", authSchema);
