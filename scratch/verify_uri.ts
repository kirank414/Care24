import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not defined in the environment.");
  process.exit(1);
}

try {
  // Parse using standard URL class
  const parsed = new URL(uri);
  
  console.log("=== MONGODB_URI CONNECTION METADATA ===");
  console.log("Protocol:", parsed.protocol);
  console.log("Hostname:", parsed.hostname);
  console.log("Database Name:", parsed.pathname ? parsed.pathname.replace(/^\//, "") : "(none)");
  
  const options: Record<string, string> = {};
  parsed.searchParams.forEach((value, key) => {
    options[key] = value;
  });
  console.log("Options:", JSON.stringify(options, null, 2));
  
  if (parsed.hostname === "cluster0.6ixn6kj.mongodb.net") {
    console.log("Verification: Hostname matches target cluster0.6ixn6kj.mongodb.net exactly!");
  } else {
    console.log("Verification WARNING: Hostname does NOT match target!");
  }
} catch (err: any) {
  console.error("Failed to parse MONGODB_URI:", err.message);
  process.exit(1);
}
