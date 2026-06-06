const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

async function completeDatabaseReset() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    const db = mongoose.connection.db;

    console.log("\n==============================================");
    console.log("COMPLETE DATABASE RESET");
    console.log("==============================================\n");

    // List of all collections to clear
    const collections = [
      "users",
      "patients",
      "caregivers",
      "bookings",
      "reviews",
      "complaints",
      "inquiries",
      "notifications",
      "carenotes",
      "servicecategories",
      "systemsettings"
    ];

    for (const collectionName of collections) {
      try {
        const result = await db.collection(collectionName).deleteMany({});
        console.log(`✓ Cleared ${collectionName}: ${result.deletedCount} documents`);
      } catch (err) {
        console.log(`- Collection ${collectionName} does not exist or error: ${err.message}`);
      }
    }

    console.log("\n==============================================");
    console.log("✅ ALL DATA CLEARED SUCCESSFULLY!");
    console.log("Database is now completely empty.");
    console.log("==============================================\n");

  } catch (err) {
    console.error("Error clearing database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
}

completeDatabaseReset();
