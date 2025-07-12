import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import morgan from "morgan";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
config({ path: path.join(process.cwd(), "server", ".env") });

// Import database connection
const connectDB = require("./config/database.js");

// Import middleware
const { errorHandler } = require("./middleware/errorHandler.js");
const { notFound } = require("./middleware/notFound.js");

// Import routes
const authRoutes = require("./routes/auth.js");
const itemRoutes = require("./routes/items.js");
const orderRoutes = require("./routes/orders.js");
const adminRoutes = require("./routes/admin.js");
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Connect to database
  connectDB();

  // Security middleware
  app.use(helmet());
  app.use(mongoSanitize());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  });
  app.use("/api/", limiter);

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:8080",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  // Body parsing middleware
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Logging middleware
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "ReWear API is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from ReWear API v2!" });
  });

  app.get("/api/demo", handleDemo);

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/admin", adminRoutes);

  // Root endpoint
  app.get("/api", (req, res) => {
    res.json({
      message: "Welcome to ReWear API",
      version: "2.0.0",
      documentation: "/api/docs",
      status: "active",
      endpoints: {
        auth: "/api/auth",
        items: "/api/items",
        orders: "/api/orders",
        admin: "/api/admin",
      },
    });
  });

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
