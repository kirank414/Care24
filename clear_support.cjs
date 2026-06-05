const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function clearSettings() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");
    const db = mongoose.connection.db;
    
    console.log("Clearing SystemSettings...");
    await db.collection("systemsettings").deleteMany({});
    
    console.log("✅ System settings cleared successfully!");
  } catch (err) {
    console.error("Error clearing settings:", err);
  } finally {
    await mongoose.disconnect();
  }
}

clearSettings();
