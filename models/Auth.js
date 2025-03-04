import mongoose from "mongoose";

// LOGIN => email and password
// SIGNUP => all fields
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
    timestamps: true, // auto record when signing up
  }
);

export default mongoose.model("Auth", authSchema);
