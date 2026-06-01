import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
console.log("Connecting using standard SRV URI from .env:", uri);

async function run() {
  mongoose.connection.on("connecting", () => console.log("Mongoose connecting..."));
  mongoose.connection.on("connected", () => console.log("Mongoose connected."));
  mongoose.connection.on("error", (err) => console.error("Mongoose connection error event:", err));

  try {
    console.log("Connecting...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected successfully using Mongoose!");
    process.exit(0);
  } catch (err: any) {
    console.error("Mongoose connection failed:");
    console.error(err);
    process.exit(1);
  }
}

run();
