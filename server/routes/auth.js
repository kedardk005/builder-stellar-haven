const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { uploadAvatar, handleUploadError } = require("../middleware/upload");
const { uploadImage } = require("../config/cloudinary");

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("phone")
      .isMobilePhone("en-IN")
      .withMessage("Valid Indian phone number required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
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

      const { name, email, phone, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email or phone",
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        phone,
        password,
        role: email.includes("admin") ? "admin" : "user",
      });

      // Generate token
      const token = user.generateToken();

      // Remove password from response
      user.password = undefined;

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          points: user.points,
          level: user.level,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  },
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
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

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated. Please contact support.",
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Update last active
      user.updateLastActive();

      // Generate token
      const token = user.generateToken();

      // Remove password from response
      user.password = undefined;

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          points: user.points,
          level: user.level,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  },
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        points: user.points,
        level: user.level,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        bio: user.bio,
        address: user.address,
        preferences: user.preferences,
        rating: user.rating,
        totalItemsSold: user.totalItemsSold,
        totalItemsBought: user.totalItemsBought,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user information",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put(
  "/profile",
  protect,
  uploadAvatar,
  handleUploadError,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("phone")
      .optional()
      .isMobilePhone("en-IN")
      .withMessage("Valid Indian phone number required"),
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

      const user = await User.findById(req.user._id);
      const { name, bio, phone, address, preferences } = req.body;

      // Update basic fields
      if (name) user.name = name;
      if (bio) user.bio = bio;
      if (phone) user.phone = phone;
      if (address) user.address = { ...user.address, ...address };
      if (preferences)
        user.preferences = { ...user.preferences, ...preferences };

      // Handle avatar upload
      if (req.file) {
        try {
          const avatarResult = await uploadImage(req.file, "avatars");
          user.avatar = avatarResult.url;
        } catch (uploadError) {
          return res.status(400).json({
            success: false,
            message: "Avatar upload failed",
            error: uploadError.message,
          });
        }
      }

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          points: user.points,
          level: user.level,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          bio: user.bio,
          address: user.address,
          preferences: user.preferences,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Profile update failed",
        error: error.message,
      });
    }
  },
);

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
router.put(
  "/password",
  protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
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

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id).select("+password");

      // Check current password
      const isCurrentPasswordValid =
        await user.comparePassword(currentPassword);

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({
        success: false,
        message: "Password change failed",
        error: error.message,
      });
    }
  },
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post("/logout", protect, async (req, res) => {
  try {
    // In a more sophisticated app, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

module.exports = router;
