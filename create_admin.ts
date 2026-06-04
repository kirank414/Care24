import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    const existing = await User.findOne({ email: "admin@care24.com" });
    if (existing) {
      existing.password = "password123";
      existing.phone = existing.phone || "+1555000000";
      await existing.save();
      console.log("Admin user password reset to password123 successfully!");
    } else {
      await User.create({
        name: "System Admin",
        email: "admin@care24.com",
        password: "password123", // Will be automatically encrypted by pre-save hook
        phone: "+1555000000",
        role: "admin"
      });
      console.log("Admin user registered successfully!");
    }
  } catch (err) {
    console.error("Error creating admin user:", err);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
