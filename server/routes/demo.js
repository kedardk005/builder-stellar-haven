const express = require("express");
const { createDemoData, clearDemoData } = require("../seeders/demoData");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/demo/seed
// @desc    Seed demo data
// @access  Public (for development/demo purposes)
router.post("/seed", async (req, res) => {
  try {
    // Only allow in development or demo environments
    if (process.env.NODE_ENV === "production" && !process.env.ALLOW_DEMO_SEED) {
      return res.status(403).json({
        success: false,
        message: "Demo data seeding not allowed in production",
      });
    }

    const result = await createDemoData();
    res.status(200).json(result);
  } catch (error) {
    console.error("Demo seed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed demo data",
      error: error.message,
    });
  }
});

// @route   DELETE /api/demo/clear
// @desc    Clear demo data
// @access  Admin only
router.delete("/clear", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    const result = await clearDemoData();
    res.status(200).json(result);
  } catch (error) {
    console.error("Demo clear error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear demo data",
      error: error.message,
    });
  }
});

// @route   GET /api/demo/status
// @desc    Check demo data status
// @access  Public
router.get("/status", async (req, res) => {
  try {
    const User = require("../models/User");
    const Item = require("../models/Item");
    const Order = require("../models/Order");

    const [demoUsers, totalItems, totalOrders] = await Promise.all([
      User.countDocuments({ email: { $regex: /@demo\.com$/ } }),
      Item.countDocuments(),
      Order.countDocuments(),
    ]);

    const isDemoDataPresent = demoUsers > 0;

    res.status(200).json({
      success: true,
      isDemoDataPresent,
      stats: {
        demoUsers,
        totalItems,
        totalOrders,
      },
      demoAccounts: isDemoDataPresent
        ? [
            { email: "admin@demo.com", role: "admin", password: "demo123" },
            { email: "emma@demo.com", role: "user", password: "demo123" },
            { email: "arjun@demo.com", role: "user", password: "demo123" },
            { email: "priya@demo.com", role: "user", password: "demo123" },
            { email: "rahul@demo.com", role: "user", password: "demo123" },
            { email: "ananya@demo.com", role: "user", password: "demo123" },
          ]
        : null,
    });
  } catch (error) {
    console.error("Demo status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get demo data status",
      error: error.message,
    });
  }
});

// @route   GET /api/demo/info
// @desc    Get demo information and instructions
// @access  Public
router.get("/info", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ReWear Demo Environment",
    description:
      "This is a demonstration version of the ReWear sustainable fashion platform.",
    features: [
      "User registration and authentication",
      "Browse and search sustainable fashion items",
      "Buy and sell pre-owned clothing",
      "User reviews and ratings",
      "Points reward system",
      "Wishlist functionality",
      "Order management",
      "Admin panel for moderation",
    ],
    demoAccounts: {
      admin: {
        email: "admin@demo.com",
        password: "demo123",
        role: "Administrator",
        description: "Full admin access to manage users, items, and orders",
      },
      users: [
        {
          email: "emma@demo.com",
          password: "demo123",
          name: "Emma Johnson",
          description: "Fashion enthusiast with many listings",
        },
        {
          email: "arjun@demo.com",
          password: "demo123",
          name: "Arjun Patel",
          description: "Sneaker collector and buyer",
        },
        {
          email: "priya@demo.com",
          password: "demo123",
          name: "Priya Singh",
          description: "Minimalist with quality focus",
        },
        {
          email: "rahul@demo.com",
          password: "demo123",
          name: "Rahul Gupta",
          description: "Formal wear specialist",
        },
        {
          email: "ananya@demo.com",
          password: "demo123",
          name: "Ananya Sharma",
          description: "New user exploring sustainable fashion",
        },
      ],
    },
    instructions: [
      "1. Use the seed endpoint to populate demo data",
      "2. Login with any demo account (password: demo123)",
      "3. Explore browsing, buying, selling features",
      "4. Test admin functions with admin account",
      "5. All transactions use demo payment methods",
    ],
    endpoints: {
      seed: "POST /api/demo/seed - Populate demo data",
      clear: "DELETE /api/demo/clear - Clear demo data (admin only)",
      status: "GET /api/demo/status - Check demo data status",
      info: "GET /api/demo/info - Get this information",
    },
  });
});

module.exports = router;
