import dns from "dns/promises";
import net from "net";
import tls from "tls";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

async function traceConnectivity() {
  console.log("=== STARTING DETAILED CONNECTIVITY TRACE ===");
  if (!uri) {
    console.error("FAIL: MONGODB_URI is not set in environment.");
    process.exit(1);
  }

  const stages = {
    dns: "NOT_STARTED",
    tcp: "NOT_STARTED",
    tls: "NOT_STARTED",
    auth: "NOT_STARTED",
    db: "NOT_STARTED",
  };

  const hostname = "cluster0.6ixn6kj.mongodb.net";
  console.log(`Hostname to verify: ${hostname}`);

  let srvRecords: dns.SrvRecord[] = [];
  let resolvedHosts: { host: string; port: number; ips: string[] }[] = [];

  // Stage 1: DNS Resolution
  try {
    stages.dns = "IN_PROGRESS";
    console.log("\n--- STAGE 1: DNS RESOLUTION ---");
    
    // Resolve SRV records for the srv connection string
    console.log(`Resolving SRV records for _mongodb._tcp.${hostname}...`);
    try {
      srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
      console.log(`Found SRV records:`, JSON.stringify(srvRecords, null, 2));
    } catch (err: any) {
      console.warn(`Warning: Could not resolve SRV records via _mongodb._tcp.${hostname}:`, err.message);
      // Fallback: try standard A record for hostname directly
      srvRecords = [{ name: hostname, port: 27017, priority: 0, weight: 0 }];
    }

    // Resolve IP addresses for each host
    for (const record of srvRecords) {
      const host = record.name;
      const port = record.port;
      console.log(`Resolving A/AAAA records for shard host: ${host}...`);
      try {
        const addresses = await dns.resolve(host);
        console.log(`Resolved IPs for ${host}:`, addresses);
        resolvedHosts.push({ host, port, ips: addresses });
      } catch (err: any) {
        console.error(`Failed to resolve IPs for ${host}:`, err.message);
      }
    }

    if (resolvedHosts.length === 0) {
      throw new Error("DNS resolution failed: No IPs could be resolved for any host.");
    }
    stages.dns = "SUCCESS";
    console.log("DNS Resolution: SUCCESS");
  } catch (err: any) {
    stages.dns = "FAILED";
    console.error("DNS Resolution: FAILED -", err.message);
    printReport(stages, hostname, [], "DNS resolution");
    process.exit(0);
  }

  // Stage 2: TCP Connection
  const allResolvedIps = resolvedHosts.flatMap(h => h.ips);
  try {
    stages.tcp = "IN_PROGRESS";
    console.log("\n--- STAGE 2: TCP CONNECTION ---");
    
    // Test TCP connection to each resolved IP/port
    for (const item of resolvedHosts) {
      for (const ip of item.ips) {
        console.log(`Testing TCP connection to ${ip}:${item.port}...`);
        await new Promise<void>((resolve, reject) => {
          const socket = new net.Socket();
          const timeout = setTimeout(() => {
            socket.destroy();
            reject(new Error(`TCP connection timed out to ${ip}:${item.port}`));
          }, 3000);

          socket.connect(item.port, ip, () => {
            clearTimeout(timeout);
            socket.end();
            resolve();
          });

          socket.on("error", (err) => {
            clearTimeout(timeout);
            socket.destroy();
            reject(err);
          });
        });
        console.log(`TCP connection to ${ip}:${item.port} established successfully.`);
      }
    }
    stages.tcp = "SUCCESS";
    console.log("TCP Connection: SUCCESS");
  } catch (err: any) {
    stages.tcp = "FAILED";
    console.error("TCP Connection: FAILED -", err.message);
    printReport(stages, hostname, allResolvedIps, "TCP connection");
    process.exit(0);
  }

  // Stage 3: TLS Handshake
  try {
    stages.tls = "IN_PROGRESS";
    console.log("\n--- STAGE 3: TLS HANDSHAKE ---");
    
    for (const item of resolvedHosts) {
      for (const ip of item.ips) {
        console.log(`Testing TLS Handshake with ${ip}:${item.port} (SNI: ${item.host})...`);
        await new Promise<void>((resolve, reject) => {
          const socket = tls.connect({
            port: item.port,
            host: ip,
            servername: item.host, // SNI is required for Atlas
            rejectUnauthorized: true,
          }, () => {
            console.log(`TLS Connection established with ${ip}. Authorized: ${socket.authorized}`);
            socket.end();
            resolve();
          });

          socket.setTimeout(3000, () => {
            socket.destroy();
            reject(new Error(`TLS handshake timed out to ${ip}:${item.port}`));
          });

          socket.on("error", (err) => {
            socket.destroy();
            reject(err);
          });
        });
      }
    }
    stages.tls = "SUCCESS";
    console.log("TLS Handshake: SUCCESS");
  } catch (err: any) {
    stages.tls = "FAILED";
    console.error("TLS Handshake: FAILED -", err.message);
    printReport(stages, hostname, allResolvedIps, "TLS handshake");
    process.exit(0);
  }

  // Stage 4 & 5: MongoDB Connection, Auth, and DB Selection
  let client: any = null;
  try {
    stages.auth = "IN_PROGRESS";
    stages.db = "IN_PROGRESS";
    console.log("\n--- STAGE 4 & 5: MONGO AUTHENTICATION & DB SELECTION ---");
    
    console.log("Instantiating MongoClient via Mongoose.mongo and attempting connection/auth...");
    client = new mongoose.mongo.MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    
    stages.auth = "SUCCESS";
    console.log("MongoDB Authentication: SUCCESS");

    console.log("Selecting database 'care24'...");
    const db = client.db("care24");
    
    console.log("Pinging database as validation check...");
    const pingResult = await db.command({ ping: 1 });
    console.log("Ping response:", pingResult);
    
    stages.db = "SUCCESS";
    console.log("Database Selection: SUCCESS");
    printReport(stages, hostname, allResolvedIps, "NONE (ALL SUCCEEDED)");
  } catch (err: any) {
    if (stages.auth === "IN_PROGRESS") {
      stages.auth = "FAILED";
      console.error("MongoDB Authentication: FAILED -", err.message);
      printReport(stages, hostname, allResolvedIps, "MongoDB authentication");
    } else {
      stages.db = "FAILED";
      console.error("Database Selection: FAILED -", err.message);
      printReport(stages, hostname, allResolvedIps, "Database selection");
    }
  } finally {
    if (client) {
      await client.close();
    }
    console.log("\nTrace complete.");
  }
}

function printReport(stages: Record<string, string>, hostname: string, ips: string[], failingStep: string) {
  console.log("\n====================================================");
  console.log("              FINAL CONNECTIVITY REPORT             ");
  console.log("====================================================");
  console.log("Hostname:", hostname);
  console.log("Resolved IPs:", ips.join(", ") || "(none)");
  console.log("Connection Stage Reached:", Object.entries(stages).filter(([k, v]) => v === "SUCCESS" || v === "FAILED").map(([k, v]) => `${k.toUpperCase()}(${v})`).join(" -> "));
  console.log("First Failing Step:", failingStep.toUpperCase());
  console.log("====================================================");
}

traceConnectivity();
