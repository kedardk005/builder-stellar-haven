const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const { config } = require("dotenv");
const path = require("path");

// Load environment variables
config({ path: path.join(__dirname, ".env") });

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

const startDevServer = async () => {
  try {
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
        origin: "http://localhost:8080", // Vite dev server
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
    app.use(morgan("dev"));

    // Health check endpoint
    app.get("/api/health", (req, res) => {
      res.status(200).json({
        status: "success",
        message: "ReWear API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
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
        environment: "development",
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

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`🚀 ReWear Backend running on port ${port}`);
      console.log(`🔧 API: http://localhost:${port}/api`);
      console.log(`💾 Database: Connected to MongoDB`);
      console.log(`🏠 Environment: development`);
    });
  } catch (error) {
    console.error("❌ Failed to start development server:", error);
    process.exit(1);
  }
};

// Start the development server
startDevServer();
