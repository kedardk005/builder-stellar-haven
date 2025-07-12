import path from "path";
import { createServer } from "./index";
import * as express from "express";
import { config } from "dotenv";

// Load environment variables
config({ path: path.join(process.cwd(), "server", ".env") });

// Import and setup full backend in production
const setupFullBackend = async () => {
  // Dynamic imports to avoid ES module issues
  const helmet = (await import("helmet")).default;
  const rateLimit = (await import("express-rate-limit")).default;
  const mongoSanitize = (await import("express-mongo-sanitize")).default;
  const compression = (await import("compression")).default;
  const morgan = (await import("morgan")).default;
  const cors = (await import("cors")).default;

  // Import CommonJS modules
  const connectDB = require("./config/database.js");
  const { errorHandler } = require("./middleware/errorHandler.js");
  const { notFound } = require("./middleware/notFound.js");
  const authRoutes = require("./routes/auth.js");
  const itemRoutes = require("./routes/items.js");
  const orderRoutes = require("./routes/orders.js");
  const adminRoutes = require("./routes/admin.js");

  // Connect to database
  await connectDB();

  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(mongoSanitize());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
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

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/admin", adminRoutes);

  // Root API endpoint
  app.get("/api", (req, res) => {
    res.json({
      message: "Welcome to ReWear API",
      version: "2.0.0",
      status: "active",
      endpoints: {
        auth: "/api/auth",
        items: "/api/items",
        orders: "/api/orders",
        admin: "/api/admin",
      },
    });
  });

  return app;
};

const startServer = async () => {
  const app = await setupFullBackend();
  const port = process.env.PORT || 3000;

  // In production, serve the built SPA files
  const __dirname = import.meta.dirname;
  const distPath = path.join(__dirname, "../spa");

  // Serve static files
  app.use(express.static(distPath));

  // Error handling middleware
  const { errorHandler } = require("./middleware/errorHandler.js");
  const { notFound } = require("./middleware/notFound.js");
  app.use(notFound);
  app.use(errorHandler);

  // Handle React Router - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
      return res.status(404).json({ error: "API endpoint not found" });
    }

    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(port, () => {
    console.log(`🚀 ReWear Server running on port ${port}`);
    console.log(`📱 Frontend: http://localhost:${port}`);
    console.log(`🔧 API: http://localhost:${port}/api`);
    console.log(`💾 Database: Connected to MongoDB`);
    console.log(`🏪 Environment: ${process.env.NODE_ENV || "production"}`);
  });
};

// Start the server
startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
