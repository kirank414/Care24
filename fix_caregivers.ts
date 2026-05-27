import mongoose from "mongoose";
import dotenv from "dotenv";
import Caregiver from "./models/Caregiver.js";
import User from "./models/User.js";

dotenv.config();

async function fixCaregivers() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    const caregivers = await Caregiver.find({});
    let count = 0;
    
    for (const cg of caregivers) {
      if (!cg.name || cg.name === "undefined" || cg.name === "") {
        const u = await User.findById(cg.user);
        if (u && u.name) {
          cg.name = u.name;
          await cg.save();
          console.log(`✓ Synchronized Caregiver ID ${cg._id} name to: "${cg.name}"`);
          count++;
        }
      }
    }
    console.log(`Synchronization finished. Updated ${count} caregiver(s).`);
  } catch (err) {
    console.error("Error during synchronization:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

fixCaregivers();
