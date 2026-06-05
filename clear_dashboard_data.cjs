const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function clearDashboardData() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    const db = mongoose.connection.db;

    console.log("Clearing Bookings...");
    await db.collection("bookings").deleteMany({});

    console.log("Clearing Complaints...");
    await db.collection("complaints").deleteMany({});

    console.log("Clearing Inquiries...");
    await db.collection("inquiries").deleteMany({});

    console.log("Clearing Care Notes...");
    await db.collection("carenotes").deleteMany({});
    
    console.log("Clearing Notifications...");
    await db.collection("notifications").deleteMany({});

    console.log("\n==============================================");
    console.log("✅ Admin Dashboard data cleared successfully!");
    console.log("All users, patients, caregivers, and services have been preserved.");
    console.log("==============================================\n");

  } catch (err) {
    console.error("Error clearing data:", err);
  } finally {
    await mongoose.disconnect();
  }
}

clearDashboardData();
