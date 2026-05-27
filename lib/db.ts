import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/care24";
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
    console.log(`Active Database: ${conn.connection.db?.databaseName}`);
  } catch (error) {
    console.error("====================================================");
    console.error("  MONGODB CONNECTION FAILURE DETAILS");
    console.error("====================================================");
    console.error(`Error Message: ${(error as Error).message}`);
    console.error("Diagnostic tips:");
    console.error("1. Check if MONGODB_URI is correctly configured in .env");
    console.error("2. Ensure your local machine's IP (e.g., 157.50.182.253) is whitelisted in Atlas");
    console.error("3. Verify active network connectivity and firewall rules");
    console.error("====================================================");

    if (process.env.NODE_ENV === "production") {
      console.error("Fatal Error: Database connection is mandatory in production environment. Terminating process.");
      process.exit(1);
    } else {
      console.warn("Dev Notice: Running without active database connection. Direct API calls will throw errors until connection is restored.");
    }
  }
};
