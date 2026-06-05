const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Use the dotenv config
dotenv.config();

async function resetDB() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Atlas successfully.");

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
    
    console.log("Clearing Reviews...");
    await db.collection("reviews").deleteMany({});
    
    console.log("Clearing Patient Profiles...");
    await db.collection("patients").deleteMany({});
    
    console.log("Clearing Caregiver Profiles...");
    await db.collection("caregivers").deleteMany({});
    
    console.log("Clearing Users (except admin)...");
    // Only delete users that do NOT have the admin role
    const deletedUsers = await db.collection("users").deleteMany({ role: { $ne: "admin" } });
    console.log(`Deleted ${deletedUsers.deletedCount} non-admin users.`);

    console.log("\n==============================================");
    console.log("✅ Database reset successfully for demo!");
    console.log("Admin account (admin@care24.com) has been preserved.");
    console.log("Services and SystemSettings have been preserved.");
    console.log("==============================================\n");

  } catch (err) {
    console.error("Error clearing data:", err);
  } finally {
    await mongoose.disconnect();
  }
}

resetDB();
