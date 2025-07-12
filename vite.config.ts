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
        console.log("🔄 Setting up backend integration...");

        // For now, use the simple server and let user set up MongoDB separately
        const app = createServer();

        // Add health check
        app.get("/api/health", (req, res) => {
          res.json({
            status: "success",
            message: "ReWear API is running (Simple Mode)",
            timestamp: new Date().toISOString(),
            note: "Full backend requires MongoDB setup",
          });
        });

        server.middlewares.use(app);
        console.log("✅ Simple backend server loaded successfully");
        console.log(
          "ℹ️  For full functionality, please set up MongoDB and update configuration",
        );
      } catch (error) {
        console.warn("⚠️ Backend setup failed:", error.message);
        // Fallback to simple server
        const app = createServer();
        server.middlewares.use(app);
      }
    },
  };
}
