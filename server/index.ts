import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Mock data - Start with clean state
const mockUsers = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@rewear.com",
    phone: "9999999999",
    points: 1000,
    level: "Expert",
    role: "admin",
    avatar: "",
    isVerified: true,
    isActive: true,
    totalItemsSold: 0,
    totalItemsBought: 0,
    rating: { average: 0, count: 0 },
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  },
];

// Start with empty items array - no dummy data
const mockItems: any[] = [];

// Keep track of logged-in user sessions
const userSessions = new Map();

export function createServer() {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mock authentication middleware
  const mockAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // For demo, always return admin user
      req.user = mockUsers.find((u) => u.role === "admin");
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    // Simple mock login - accept admin@rewear.com with password "admin"
    if (email === "admin@rewear.com" && password === "admin") {
      const user = mockUsers.find((u) => u.email === email);
      res.json({
        success: true,
        message: "Login successful",
        token: "mock-jwt-token",
        user,
      });
    } else if (email === "user@rewear.com" && password === "user") {
      const user = mockUsers.find((u) => u.email === "john@example.com");
      res.json({
        success: true,
        message: "Login successful",
        token: "mock-jwt-token",
        user,
      });
    } else {
      res.status(401).json({
        success: false,
        message:
          "Invalid credentials. Try admin@rewear.com/admin or user@rewear.com/user",
      });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, phone, password } = req.body;

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || "9999999999",
      points: 0, // New users start with 0 points
      level: "Beginner",
      role: email.includes("admin") ? "admin" : "user",
      avatar: "",
      isVerified: false,
      isActive: true,
      totalItemsSold: 0,
      totalItemsBought: 0,
      rating: { average: 0, count: 0 },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: "mock-jwt-token",
      user: newUser,
    });
  });

  app.get("/api/auth/me", mockAuth, (req: any, res) => {
    if (req.user) {
      res.json({
        success: true,
        user: req.user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  });

  // Admin routes
  app.get("/api/admin/stats", mockAuth, (req, res) => {
    res.json({
      success: true,
      data: {
        pendingItems: 1,
        flaggedItems: 0,
        activeUsers: 2,
        totalItems: 1,
        totalUsers: 2,
        soldItems: 0,
        revenue: 0,
        activeItems: 0,
        approvedItems: 0,
        rejectedItems: 0,
      },
    });
  });

  app.get("/api/admin/items/pending", mockAuth, (req, res) => {
    const pendingItems = mockItems.filter((item) => item.status === "pending");
    res.json({
      success: true,
      data: pendingItems,
    });
  });

  app.get("/api/admin/items/flagged", mockAuth, (req, res) => {
    const flaggedItems = mockItems.filter((item) => item.status === "flagged");
    res.json({
      success: true,
      data: flaggedItems,
    });
  });

  app.get("/api/admin/users", mockAuth, (req, res) => {
    const { search } = req.query;
    let users = [...mockUsers];

    if (search) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toString().toLowerCase()) ||
          user.email.toLowerCase().includes(search.toString().toLowerCase()),
      );
    }

    res.json({
      success: true,
      data: users,
    });
  });

  app.post("/api/admin/items/approve", mockAuth, (req, res) => {
    const { itemId, qualityBadge } = req.body;
    const item = mockItems.find((i) => i.id === itemId || i._id === itemId);

    if (item) {
      item.status = "approved" as any;
      if (qualityBadge) {
        item.qualityBadge = qualityBadge;
      }

      res.json({
        success: true,
        message: "Item approved successfully",
        data: item,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
  });

  app.post("/api/admin/items/reject", mockAuth, (req, res) => {
    const { itemId, reason } = req.body;
    const item = mockItems.find((i) => i.id === itemId || i._id === itemId);

    if (item) {
      item.status = "rejected" as any;

      res.json({
        success: true,
        message: "Item rejected successfully",
        data: item,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
  });

  app.post("/api/admin/users/grant-points", mockAuth, (req, res) => {
    const { userId, points, reason } = req.body;
    const user = mockUsers.find((u) => u.id === userId);

    if (user) {
      user.points += points;

      res.json({
        success: true,
        message: "Points granted successfully",
        data: { user },
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  });

  // Items routes
  app.get("/api/items", (req, res) => {
    const { search, category, condition, sortBy } = req.query;
    let items = [...mockItems];

    // Filter by search
    if (search) {
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toString().toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(search.toString().toLowerCase()) ||
          item.brand.toLowerCase().includes(search.toString().toLowerCase()),
      );
    }

    // Filter by category
    if (category) {
      items = items.filter((item) => item.category === category);
    }

    // Filter by condition
    if (condition) {
      items = items.filter((item) => item.condition === condition);
    }

    res.json({
      success: true,
      data: items,
      pagination: {
        page: 1,
        limit: 10,
        total: items.length,
        pages: 1,
      },
    });
  });

  app.get("/api/items/:id", (req, res) => {
    const { id } = req.params;
    const item = mockItems.find((i) => i.id === id || i._id === id);

    if (item) {
      res.json({
        success: true,
        data: item,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
  });

  app.post("/api/items", mockAuth, (req, res) => {
    // Mock item creation - in reality this would handle FormData with images
    const itemData = req.body;

    const newItem = {
      id: Date.now().toString(),
      _id: Date.now().toString(),
      title: itemData.title || "New Item",
      description: itemData.description || "Item description",
      category: itemData.category || "Other",
      brand: itemData.brand || "Unknown",
      size: itemData.size || "M",
      color: itemData.color || "Black",
      condition: itemData.condition || "Good",
      price: itemData.price || 20,
      originalPrice: itemData.originalPrice || 50,
      images: [{ url: "/placeholder.svg", isPrimary: true }], // Mock image
      seller: req.user || mockUsers[1],
      status: "pending",
      qualityBadge: "basic",
      views: 0,
      likes: 0,
      featured: false,
      createdAt: new Date().toISOString(),
      flaggedReasons: [],
    };

    mockItems.push(newItem);

    // Award points for listing an item
    if (req.user) {
      req.user.points += 10;
    }

    res.status(201).json({
      success: true,
      message:
        "Item created successfully. It will be reviewed before going live.",
      data: newItem,
    });
  });

  app.get("/api/items/user/my-items", mockAuth, (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userItems = mockItems.filter(
      (item) => item.seller.id === req.user.id,
    );

    res.json({
      success: true,
      data: userItems,
    });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
