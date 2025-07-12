const express = require("express");
const { body, validationResult, query } = require("express-validator");
const Item = require("../models/Item");
const User = require("../models/User");
const { protect, optionalAuth } = require("../middleware/auth");
const { uploadMultiple, handleUploadError } = require("../middleware/upload");
const { uploadMultipleImages } = require("../config/cloudinary");

const router = express.Router();

// @desc    Get all items (public)
// @route   GET /api/items
// @access  Public
router.get(
  "/",
  optionalAuth,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Invalid page"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Invalid limit"),
    query("category").optional().isString().withMessage("Invalid category"),
    query("condition").optional().isString().withMessage("Invalid condition"),
    query("minPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Invalid min price"),
    query("maxPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Invalid max price"),
    query("search").optional().isString().withMessage("Invalid search term"),
    query("sortBy")
      .optional()
      .isIn(["createdAt", "price", "views", "likes"])
      .withMessage("Invalid sort field"),
    query("sortOrder")
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Invalid sort order"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const {
        page = 1,
        limit = 12,
        category,
        condition,
        minPrice,
        maxPrice,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
        featured,
      } = req.query;

      // Build query
      const query = { status: "active" };

      if (category) query.category = category;
      if (condition) query.condition = condition;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }
      if (featured === "true") query.featured = true;

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ];
      }

      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;

      // Execute query
      const items = await Item.find(query)
        .populate("seller", "name avatar rating isVerified")
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      // Get total count
      const total = await Item.countDocuments(query);

      // Add user interaction data if authenticated
      const itemsWithUserData = items.map((item) => {
        const itemObj = item.toObject();
        if (req.user) {
          itemObj.isLiked = item.likedBy.includes(req.user._id);
        }
        return itemObj;
      });

      res.json({
        success: true,
        data: itemsWithUserData,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Get items error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch items",
        error: error.message,
      });
    }
  },
);

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate(
        "seller",
        "name avatar rating isVerified phone email address createdAt",
      )
      .populate("soldTo", "name");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Increment views
    if (req.user && req.user._id.toString() !== item.seller._id.toString()) {
      item.incrementViews();
    }

    // Add user interaction data
    const itemObj = item.toObject();
    if (req.user) {
      itemObj.isLiked = item.likedBy.includes(req.user._id);
      itemObj.canEdit = req.user._id.toString() === item.seller._id.toString();
    }

    res.json({
      success: true,
      data: itemObj,
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: error.message,
    });
  }
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
router.post(
  "/",
  protect,
  uploadMultiple,
  handleUploadError,
  [
    body("title")
      .trim()
      .isLength({ min: 5, max: 100 })
      .withMessage("Title must be between 5 and 100 characters"),
    body("description")
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage("Description must be between 20 and 2000 characters"),
    body("category")
      .isIn([
        "Tops",
        "Bottoms",
        "Dresses",
        "Shoes",
        "Accessories",
        "Outerwear",
        "Activewear",
        "Formal",
        "Casual",
        "Vintage",
      ])
      .withMessage("Invalid category"),
    body("brand")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Brand is required and must be less than 50 characters"),
    body("size")
      .isIn([
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "XXXL",
        "One Size",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
      ])
      .withMessage("Invalid size"),
    body("color")
      .trim()
      .isLength({ min: 1, max: 30 })
      .withMessage("Color is required"),
    body("condition")
      .isIn(["Like New", "Excellent", "Good", "Fair"])
      .withMessage("Invalid condition"),
    body("price")
      .isFloat({ min: 0.01 })
      .withMessage("Price must be greater than 0"),
    body("originalPrice")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Invalid original price"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Check if images are provided
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one image is required",
        });
      }

      // Upload images to Cloudinary
      let images;
      try {
        const uploadResults = await uploadMultipleImages(req.files, "items");
        images = uploadResults.map((result, index) => ({
          url: result.url,
          publicId: result.publicId,
          isPrimary: index === 0, // First image is primary
        }));
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Image upload failed",
          error: uploadError.message,
        });
      }

      // Create item
      const itemData = {
        ...req.body,
        seller: req.user._id,
        images,
        status: "pending", // Items need admin approval
      };

      // Parse tags and materials if provided
      if (req.body.tags) {
        itemData.tags = JSON.parse(req.body.tags);
      }
      if (req.body.materials) {
        itemData.materials = JSON.parse(req.body.materials);
      }
      if (req.body.measurements) {
        itemData.measurements = JSON.parse(req.body.measurements);
      }
      if (req.body.shippingInfo) {
        itemData.shippingInfo = {
          ...itemData.shippingInfo,
          ...JSON.parse(req.body.shippingInfo),
        };
      }

      const item = await Item.create(itemData);

      // Populate seller info
      await item.populate("seller", "name avatar rating");

      res.status(201).json({
        success: true,
        message: "Item created successfully and submitted for approval",
        data: item,
      });
    } catch (error) {
      console.error("Create item error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create item",
        error: error.message,
      });
    }
  },
);

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Owner only)
router.put("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
    }

    // Don't allow updates to sold items
    if (item.status === "sold") {
      return res.status(400).json({
        success: false,
        message: "Cannot update sold items",
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      "title",
      "description",
      "price",
      "originalPrice",
      "condition",
      "conditionDescription",
      "tags",
      "materials",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    // If item was rejected and now being updated, reset to pending
    if (item.status === "rejected") {
      item.status = "pending";
      item.rejectionReason = undefined;
      item.rejectedAt = undefined;
      item.rejectedBy = undefined;
    }

    await item.save();

    res.json({
      success: true,
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message,
    });
  }
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Owner only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Check ownership
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      });
    }

    // Don't allow deletion of sold items
    if (item.status === "sold") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete sold items",
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
});

// @desc    Like/Unlike item
// @route   POST /api/items/:id/like
// @access  Private
router.post("/:id/like", protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await item.toggleLike(req.user._id);

    res.json({
      success: true,
      message: "Like status updated",
      data: {
        likes: item.likes,
        isLiked: item.likedBy.includes(req.user._id),
      },
    });
  } catch (error) {
    console.error("Like item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update like status",
      error: error.message,
    });
  }
});

// @desc    Flag item
// @route   POST /api/items/:id/flag
// @access  Private
router.post(
  "/:id/flag",
  protect,
  [
    body("reason")
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage("Reason must be between 5 and 200 characters"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { reason } = req.body;
      const item = await Item.findById(req.params.id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }

      // Don't allow flagging own items
      if (item.seller.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot flag your own item",
        });
      }

      await item.flagItem(req.user._id, reason);

      res.json({
        success: true,
        message: "Item flagged successfully",
      });
    } catch (error) {
      console.error("Flag item error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to flag item",
        error: error.message,
      });
    }
  },
);

// @desc    Get user's items
// @route   GET /api/items/user/my-items
// @access  Private
router.get("/user/my-items", protect, async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;

    // Build query
    const query = { seller: req.user._id };
    if (status) query.status = status;

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("soldTo", "name")
      .exec();

    const total = await Item.countDocuments(query);

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
    console.error("Get user items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user items",
      error: error.message,
    });
  }
});

module.exports = router;
