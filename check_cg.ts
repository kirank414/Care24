import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "c:/Users/Dell/Documents/Dell/OneDrive/Desktop/Care24/Care24/.env" });

mongoose.connect(process.env.MONGODB_URI!).then(async () => {
  const db = mongoose.connection.db;
  const cg = await db.collection("caregivers").find({}).toArray();
  console.log(cg);
  process.exit(0);
});
