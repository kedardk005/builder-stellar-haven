import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getPendingItems,
  getFlaggedItems,
  getUsers,
  approveItem,
  rejectItem,
  updateQuality,
  grantPoints,
  moderateContent,
  getAdminStats,
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Admin API routes
  app.get("/api/admin/stats", getAdminStats);
  app.get("/api/admin/items/pending", getPendingItems);
  app.get("/api/admin/items/flagged", getFlaggedItems);
  app.get("/api/admin/users", getUsers);
  app.post("/api/admin/items/approve", approveItem);
  app.post("/api/admin/items/reject", rejectItem);
  app.post("/api/admin/items/quality", updateQuality);
  app.post("/api/admin/users/grant-points", grantPoints);
  app.post("/api/admin/content/moderate", moderateContent);

  return app;
}
