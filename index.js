// TODO:
// future session and auth management:
//    - setup express-session
//    - setup passport

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import router from "./routes/routes.js";
import mongoose from "mongoose";

// our express server instance
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(function () {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  });

app.use("/", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Pro-ject server is running on ${PORT}`);
});
