const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Item = require("../models/Item");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// All routes are protected with admin authentication
router.use(protect);
router.use(adminOnly);

// @desc    Get pending items for approval
// @route   GET /api/admin/items/pending
// @access  Private/Admin
router.get("/items/pending", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const items = await Item.find({ status: "pending" })
      .populate("seller", "name email avatar rating")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments({ status: "pending" });

    res.json({
      success: true,
      data: items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get pending items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending items",
      error: error.message,
    });
  }
});

// @desc    Get flagged items for moderation
// @route   GET /api/admin/items/flagged
// @access  Private/Admin
router.get("/items/flagged", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const items = await Item.find({ status: "flagged" })
      .populate("seller", "name email avatar rating")
      .populate("flaggedBy.user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments({ status: "flagged" });

    res.json({
      success: true,
      data: items,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get flagged items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch flagged items",
      error: error.message,
    });
  }
});

// @desc    Get users for management
// @route   GET /api/admin/users
// @access  Private/Admin
router.get("/users", async (req, res) => {
  try {
    const { search, page = 1, limit = 10, role, isActive } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// @desc    Approve an item
// @route   POST /api/admin/items/approve
// @access  Private/Admin
router.post(
  "/items/approve",
  [
    body("itemId").isMongoId().withMessage("Valid item ID required"),
    body("qualityBadge")
      .optional()
      .isIn(["basic", "medium", "high", "premium"])
      .withMessage("Invalid quality badge"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { itemId, qualityBadge } = req.body;

      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      if (item.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Item is not pending approval",
        });
      }

      // Approve the item
      await item.approveItem(req.user._id, qualityBadge);

      // Activate the item immediately after approval
      await item.activateItem();

      // Award points to seller
      const seller = await User.findById(item.seller);
      if (seller) {
        await seller.addPoints(10, "Item approved");
      }

      res.json({
        success: true,
        message: "Item approved successfully",
        data: item,
      });
    } catch (error) {
      console.error("Approve item error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to approve item",
        error: error.message,
      });
    }
  },
);

// @desc    Reject an item
// @route   POST /api/admin/items/reject
// @access  Private/Admin
router.post(
  "/items/reject",
  [
    body("itemId").isMongoId().withMessage("Valid item ID required"),
    body("reason")
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage("Reason must be between 5 and 500 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { itemId, reason } = req.body;

      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      if (item.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: "Item is not pending approval",
        });
      }

      // Reject the item
      await item.rejectItem(req.user._id, reason);

      res.json({
        success: true,
        message: "Item rejected successfully",
        data: item,
      });
    } catch (error) {
      console.error("Reject item error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to reject item",
        error: error.message,
      });
    }
  },
);

// @desc    Update item quality badge
// @route   POST /api/admin/items/quality
// @access  Private/Admin
router.post(
  "/items/quality",
  [
    body("itemId").isMongoId().withMessage("Valid item ID required"),
    body("qualityBadge")
      .isIn(["basic", "medium", "high", "premium"])
      .withMessage("Invalid quality badge"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { itemId, qualityBadge } = req.body;

      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      item.qualityBadge = qualityBadge;
      await item.save();

      res.json({
        success: true,
        message: "Quality badge updated successfully",
        data: item,
      });
    } catch (error) {
      console.error("Update quality error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update quality badge",
        error: error.message,
      });
    }
  },
);

// @desc    Grant points to user
// @route   POST /api/admin/users/grant-points
// @access  Private/Admin
router.post(
  "/users/grant-points",
  [
    body("userId").isMongoId().withMessage("Valid user ID required"),
    body("points")
      .isInt({ min: 1, max: 10000 })
      .withMessage("Points must be between 1 and 10000"),
    body("reason")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Reason must be between 5 and 200 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { userId, points, reason } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Grant points
      await user.addPoints(points, `Admin grant: ${reason}`);

      res.json({
        success: true,
        message: `${points} points granted to ${user.name}`,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            points: user.points,
            level: user.level,
          },
          pointsGranted: points,
          reason,
        },
      });
    } catch (error) {
      console.error("Grant points error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to grant points",
        error: error.message,
      });
    }
  },
);

// @desc    Handle moderation actions
// @route   POST /api/admin/content/moderate
// @access  Private/Admin
router.post(
  "/content/moderate",
  [
    body("itemId").isMongoId().withMessage("Valid item ID required"),
    body("action").isIn(["remove", "restore"]).withMessage("Invalid action"),
    body("reason")
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Reason must be between 5 and 200 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { itemId, action, reason } = req.body;

      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      if (action === "remove") {
        item.status = "inactive";
        await item.save();

        res.json({
          success: true,
          message: "Content removed successfully",
        });
      } else if (action === "restore") {
        item.status = "active";
        item.flaggedBy = [];
        await item.save();

        res.json({
          success: true,
          message: "Content restored successfully",
          data: item,
        });
      }
    } catch (error) {
      console.error("Moderate content error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to moderate content",
        error: error.message,
      });
    }
  },
);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get("/stats", async (req, res) => {
  try {
    // Get various counts in parallel
    const [
      pendingItems,
      flaggedItems,
      activeUsers,
      totalItems,
      totalUsers,
      soldItems,
    ] = await Promise.all([
      Item.countDocuments({ status: "pending" }),
      Item.countDocuments({ status: "flagged" }),
      User.countDocuments({ isActive: true }),
      Item.countDocuments(),
      User.countDocuments(),
      Item.countDocuments({ status: "sold" }),
    ]);

    // Calculate revenue (sum of sold items prices)
    const revenueResult = await Item.aggregate([
      { $match: { status: "sold" } },
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
    ]);

    const revenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const stats = {
      pendingItems,
      flaggedItems,
      activeUsers,
      totalItems,
      totalUsers,
      soldItems,
      revenue,
      activeItems: await Item.countDocuments({ status: "active" }),
      approvedItems: await Item.countDocuments({ status: "approved" }),
      rejectedItems: await Item.countDocuments({ status: "rejected" }),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
      error: error.message,
    });
  }
});

module.exports = router;
