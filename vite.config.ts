import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      // Setup backend middleware for development
      try {
        // Dynamic imports for CommonJS modules
        const setupBackend = async () => {
          const express = require("express");
          const cors = require("cors");
          const helmet = require("helmet");
          const mongoSanitize = require("express-mongo-sanitize");
          const compression = require("compression");
          const morgan = require("morgan");
          const { config } = require("dotenv");

          // Load environment variables
          config({ path: path.join(process.cwd(), "server", ".env") });

          // Connect to database
          const connectDB = require("./server/config/database.js");
          await connectDB();

          // Import routes
          const authRoutes = require("./server/routes/auth.js");
          const itemRoutes = require("./server/routes/items.js");
          const orderRoutes = require("./server/routes/orders.js");
          const adminRoutes = require("./server/routes/admin.js");

          // Create backend app
          const app = express();

          // Middleware
          app.use(helmet());
          app.use(mongoSanitize());
          app.use(
            cors({
              origin: "http://localhost:8080",
              credentials: true,
              methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
              allowedHeaders: ["Content-Type", "Authorization"],
            }),
          );
          app.use(compression());
          app.use(express.json({ limit: "10mb" }));
          app.use(express.urlencoded({ extended: true, limit: "10mb" }));
          app.use(morgan("dev"));

          // Health check
          app.get("/api/health", (req, res) => {
            res.json({
              status: "success",
              message: "ReWear API is running",
              timestamp: new Date().toISOString(),
            });
          });

          // API routes
          app.use("/api/auth", authRoutes);
          app.use("/api/items", itemRoutes);
          app.use("/api/orders", orderRoutes);
          app.use("/api/admin", adminRoutes);

          return app;
        };

        const backendApp = await setupBackend();
        server.middlewares.use(backendApp);

        console.log("✅ Backend middleware loaded successfully");
      } catch (error) {
        console.warn(
          "⚠️ Backend setup failed, using simple server:",
          error.message,
        );
        // Fallback to simple server
        const app = createServer();
        server.middlewares.use(app);
      }
    },
  };
}
