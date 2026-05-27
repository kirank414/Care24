import mongoose from "mongoose";
import dotenv from "dotenv";
import Caregiver from "./models/Caregiver.js";
import User from "./models/User.js";

dotenv.config();

async function dump() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    const caregivers = await Caregiver.find({});
    console.log(`--- DUMPING ${caregivers.length} CAREGIVERS FROM DB ---`);
    for (const cg of caregivers) {
      const u = await User.findById(cg.user);
      console.log({
        caregiverId: cg._id,
        caregiverNameField: cg.name,
        userRefId: cg.user,
        userRefName: u ? u.name : "USER NOT FOUND",
        userRefEmail: u ? u.email : "USER NOT FOUND",
        title: cg.title,
        isVerified: cg.isVerified
      });
    }
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("Error during dump:", err);
  } finally {
    await mongoose.disconnect();
  }
}

dump();
