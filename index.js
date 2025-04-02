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
import session from "express-session";
import MongoStore from "connect-mongo";

// our express server instance
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// remove localhost after testing
const corsOptions = {
  origin: ["http://localhost:5173", "https://pro-ject.app.dlsu-lscs.org"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// app.use(cors(corsOptions));
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(function () {
    console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  })
  .catch(function (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if DB connection fails
  });

mongoose.connection.once("open", async function () {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Available collections in MongoDB: ");
    collections.forEach(function (collection) {
      console.log(`- ${collection.name}`);
    });
  } catch (err) {
    console.error("Error listing collections: ", err.message);
  }
});

// commented since we already have the cors middleware above
// app.options("*", cors());

// start testing session
// for implmentation of session test
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.DB_NAME,
      ttl: 60 * 60, // 1 hour session expiry
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // will evaluate to true if in production
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    },
  })
);

// move cors here (below session middleware) to allow credentials to be sent
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (!req.session) {
    console.warn("Session is not initialized.");
  } else {
    req.session.visited = true;
    if (process.env.NODE_ENV !== "production") {
      console.log(`Session active for user: ${req.session.id}`);
    }
  }
  next();
});
// end session test

app.use("/", router); // router contains all the routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log(`Pro-ject server is running on ${PORT}`);
});
