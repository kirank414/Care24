import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Connect to Database
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Care24 API is operational" });
  });

  // Mock endpoints for Care24
  app.get("/api/services", (req, res) => {
    res.json([
      { id: 1, title: "Nursing Care", description: "Professional medical care at home.", price: "From $50/visit", icon: "stethosope" },
      { id: 2, title: "Physiotherapy", description: "Restoring mobility and strength.", price: "From $45/session", icon: "activity" },
      { id: 3, title: "Elderly Attendant", description: "Daily assistance and companionship.", price: "From $30/day", icon: "heart" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Care24 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
