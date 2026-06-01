import mongoose from "mongoose";
import dotenv from "dotenv";
import ServiceCategory from "./models/ServiceCategory.js";

dotenv.config({ path: "c:/Users/Dell/Documents/Dell/OneDrive/Desktop/Care24/Care24/.env" });

const MONGODB_URI = process.env.MONGODB_URI;

const coreServices = [
  {
    title: "Elderly Attendant",
    description: "Compassionate daily assistance for elderly individuals, including mobility support, meal preparation, and companionship.",
    priceRange: "Standard Rates",
    icon: "UserPlus",
    features: ["Mobility Assistance", "Companionship", "Meal Preparation", "Medication Reminders"]
  },
  {
    title: "Nursing Care",
    description: "Professional nursing care for post-surgery recovery, wound dressing, and chronic illness management at home.",
    priceRange: "Standard Rates",
    icon: "Activity",
    features: ["Wound Dressing", "Vitals Monitoring", "Injections & IV", "Post-Surgery Care"]
  },
  {
    title: "Physiotherapy",
    description: "Expert physiotherapists to help restore movement, reduce pain, and improve overall physical function.",
    priceRange: "Standard Rates",
    icon: "Heart",
    features: ["Pain Management", "Mobility Exercises", "Post-Stroke Rehab", "Orthopedic Rehab"]
  },
  {
    title: "Post-Hospital Care",
    description: "Professional recovery assistance after discharge, helping patients transition safely from hospital to home.",
    priceRange: "Standard Rates",
    icon: "Activity",
    features: ["Recovery Monitoring", "Medication Assistance", "Mobility Support", "Follow-Up Care"]
  }
];

mongoose.connect(MONGODB_URI!)
  .then(async () => {
    console.log("Successfully connected to MongoDB Atlas!");
    
    // 1. Delete all existing services
    const deleteResult = await ServiceCategory.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} junk services.`);

    // 2. Insert the correct core services
    const insertResult = await ServiceCategory.insertMany(coreServices);
    console.log(`Successfully seeded ${insertResult.length} core services.`);

    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  });
