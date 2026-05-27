import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to MONGODB_URI:", MONGODB_URI);

mongoose.connect(MONGODB_URI!)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  });
