import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function dump() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    const users = await User.find({});
    console.log(`--- DUMPING ${users.length} USERS FROM DB ---`);
    for (const u of users) {
      console.log({
        userId: u._id,
        name: u.name,
        email: u.email,
        role: u.role
      });
    }
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("Error during user dump:", err);
  } finally {
    await mongoose.disconnect();
  }
}

dump();
