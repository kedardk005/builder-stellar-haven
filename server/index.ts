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
      const token = authHeader.substring(7);
      // Get user from session
      const user = userSessions.get(token);
      if (user) {
        req.user = user;
      }
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    let user = mockUsers.find((u) => u.email === email);

    // Simple mock login - accept admin@rewear.com with password "admin"
    if (email === "admin@rewear.com" && password === "admin") {
      if (!user) {
        user = mockUsers[0]; // Admin user
      }
    } else {
      // For any other user, check if they exist
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Please register first.",
        });
      }
      // For simplicity, accept any password for existing users
    }

    if (user) {
      // Generate unique token
      const token = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Store user session
      userSessions.set(token, user);

      res.json({
        success: true,
        message: "Login successful",
        token,
        user,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

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

    // Generate unique token and store session
    const token = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    userSessions.set(token, newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
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

  app.put("/api/auth/profile", mockAuth, (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { name, email, phone, bio } = req.body;

    // Update user data
    if (name) req.user.name = name;
    if (email) req.user.email = email;
    if (phone) req.user.phone = phone;
    if (bio) req.user.bio = bio;

    // Update in users array
    const userIndex = mockUsers.findIndex((u) => u.id === req.user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...req.user };
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: req.user,
    });
  });

  // Admin routes
  app.get("/api/admin/stats", mockAuth, (req, res) => {
    const pendingItems = mockItems.filter(
      (item) => item.status === "pending",
    ).length;
    const flaggedItems = mockItems.filter(
      (item) => item.status === "flagged",
    ).length;
    const approvedItems = mockItems.filter(
      (item) => item.status === "approved" || item.status === "active",
    ).length;
    const rejectedItems = mockItems.filter(
      (item) => item.status === "rejected",
    ).length;
    const soldItems = mockItems.filter((item) => item.status === "sold").length;

    res.json({
      success: true,
      data: {
        pendingItems,
        flaggedItems,
        activeUsers: mockUsers.filter((u) => u.isActive).length,
        totalItems: mockItems.length,
        totalUsers: mockUsers.length,
        soldItems,
        revenue: 0,
        activeItems: approvedItems,
        approvedItems,
        rejectedItems,
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

      // Award bonus points to seller for approved item
      const seller = mockUsers.find((u) => u.id === item.seller.id);
      if (seller) {
        let bonusPoints = 0;
        // Award bonus for high-quality items
        if (qualityBadge === "premium") {
          bonusPoints = 3;
        } else if (qualityBadge === "high") {
          bonusPoints = 2;
        } else if (qualityBadge === "medium") {
          bonusPoints = 1;
        }

        if (bonusPoints > 0) {
          seller.points += bonusPoints;
        }
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

  // Items routes - Only show approved/active items for public browse
  app.get("/api/items", (req, res) => {
    const { search, category, condition, sortBy } = req.query;
    // Only show approved/active items for public browsing
    let items = mockItems.filter(
      (item) => item.status === "approved" || item.status === "active",
    );

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

    const basePrice = parseInt(itemData.price) || 20;

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
      price: basePrice,
      originalPrice: itemData.originalPrice || basePrice * 2,
      pointsValue: Math.ceil(basePrice / 10) || 3, // Points needed to redeem
      swapValue: basePrice, // Value for swap calculations
      images: [{ url: "/placeholder.svg", isPrimary: true }], // Mock image
      seller: req.user || mockUsers[0],
      status: "pending",
      qualityBadge: "basic",
      views: 0,
      likes: 0,
      likedBy: [],
      featured: false,
      createdAt: new Date().toISOString(),
      flaggedReasons: [],
      swapEnabled: true, // Enable all exchange methods by default
      pointsEnabled: true,
      purchaseEnabled: true,
      tags: [itemData.category || "fashion"],
    };

    mockItems.push(newItem);

    // Award points for listing an item (as per specification: +1 point)
    if (req.user) {
      req.user.points += 1;
    }

    res.status(201).json({
      success: true,
      message:
        "Item created successfully. It will be reviewed before going live. You earned +1 point!",
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

  // Exchange routes

  // 1. Swap Request
  app.post("/api/items/:id/swap", mockAuth, (req, res) => {
    const { id } = req.params;
    const { message, offeredItemId } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const item = mockItems.find((i) => i.id === id || i._id === id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (!item.swapEnabled) {
      return res
        .status(400)
        .json({ success: false, message: "Swap not available for this item" });
    }

    // Mock swap request creation
    const swapRequest = {
      id: Date.now().toString(),
      itemId: id,
      requesterId: req.user.id,
      sellerId: item.seller.id,
      message: message || "I'd like to swap for this item",
      offeredItemId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: "Swap request sent successfully!",
      data: swapRequest,
    });
  });

  // 2. Points Redemption
  app.post("/api/items/:id/redeem", mockAuth, (req, res) => {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const item = mockItems.find((i) => i.id === id || i._id === id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (!item.pointsEnabled) {
      return res.status(400).json({
        success: false,
        message: "Points redemption not available for this item",
      });
    }

    const pointsCost = item.pointsValue || 3;

    if (req.user.points < pointsCost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You need ${pointsCost} points but have ${req.user.points}`,
      });
    }

    // Deduct points and create order
    req.user.points -= pointsCost;
    item.status = "sold";

    // Award points to seller for successful exchange (+3 as per specification)
    const seller = mockUsers.find((u) => u.id === item.seller.id);
    if (seller) {
      seller.points += 3;
    }

    const order = {
      id: Date.now().toString(),
      itemId: id,
      buyerId: req.user.id,
      sellerId: item.seller.id,
      method: "points",
      pointsUsed: pointsCost,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: `Item redeemed successfully! ${pointsCost} points deducted. Seller earned +3 points.`,
      data: order,
    });
  });

  // 3. INR Purchase
  app.post("/api/items/:id/purchase", mockAuth, (req, res) => {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const item = mockItems.find((i) => i.id === id || i._id === id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (!item.purchaseEnabled) {
      return res.status(400).json({
        success: false,
        message: "Purchase not available for this item",
      });
    }

    // Mock payment processing (in reality, integrate with Razorpay)
    const order = {
      id: Date.now().toString(),
      itemId: id,
      buyerId: req.user.id,
      sellerId: item.seller.id,
      method: "purchase",
      amount: item.price,
      currency: "INR",
      paymentMethod: paymentMethod || "razorpay",
      status: "pending_payment",
      createdAt: new Date().toISOString(),
      razorpayOrderId: `order_${Date.now()}`, // Mock Razorpay order ID
    };

    res.json({
      success: true,
      message:
        "Order created successfully. Complete payment to finalize purchase.",
      data: order,
      paymentUrl: `/payment/${order.id}`, // Mock payment URL
    });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Demo data management routes (only available when MongoDB models are working)
  // app.use("/api/demo", demoRoutes);

  return app;
}
