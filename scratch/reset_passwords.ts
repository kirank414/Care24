import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

async function resetPasswords() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB database.");

    // Update Admin
    const admin = await User.findOne({ email: "admin@care24.com" });
    if (admin) {
      admin.password = "Password123!";
      if (!admin.phone) {
        admin.phone = "+1555000000";
      }
      await admin.save();
      console.log("✓ Reset admin@care24.com password to: Password123!");
    } else {
      await User.create({
        name: "System Admin",
        email: "admin@care24.com",
        password: "Password123!",
        phone: "+1555000000",
        role: "admin"
      });
      console.log("✓ Created admin@care24.com user with password: Password123!");
    }

    // Update Patient
    const patient = await User.findOne({ email: "patient@gmail.com" });
    if (patient) {
      patient.password = "Password123!";
      if (!patient.phone) {
        patient.phone = "+1555019999";
      }
      await patient.save();
      console.log("✓ Reset patient@gmail.com password to: Password123!");
    } else {
      await User.create({
        name: "Alice Patient",
        email: "patient@gmail.com",
        password: "Password123!",
        phone: "+1555019999",
        role: "user"
      });
      console.log("✓ Created patient@gmail.com user with password: Password123!");
    }

    // Update Caregiver
    const caregiver = await User.findOne({ email: "cg@gmail.com" });
    if (caregiver) {
      caregiver.password = "Password123!";
      if (!caregiver.phone) {
        caregiver.phone = "+1555018888";
      }
      await caregiver.save();
      console.log("✓ Reset cg@gmail.com password to: Password123!");
    } else {
      await User.create({
        name: "Bob Caregiver",
        email: "cg@gmail.com",
        password: "Password123!",
        phone: "+1555018888",
        role: "caregiver"
      });
      console.log("✓ Created cg@gmail.com user with password: Password123!");
    }

    console.log("All test accounts configured successfully!");
  } catch (err) {
    console.error("Error during password reset:", err);
  } finally {
    await mongoose.disconnect();
  }
}

resetPasswords();
