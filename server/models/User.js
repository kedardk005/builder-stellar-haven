const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "India" },
      postalCode: { type: String, default: "" },
    },
    points: {
      type: Number,
      default: 0,
      min: [0, "Points cannot be negative"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Explorer", "Enthusiast", "Expert", "Master"],
      default: "Beginner",
    },
    totalItemsSold: {
      type: Number,
      default: 0,
    },
    totalItemsBought: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      privacy: {
        showEmail: { type: Boolean, default: false },
        showPhone: { type: Boolean, default: false },
      },
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for user level based on points
userSchema.virtual("levelInfo").get(function () {
  const points = this.points;
  if (points < 100)
    return {
      level: "Beginner",
      nextLevel: "Explorer",
      pointsNeeded: 100 - points,
    };
  if (points < 500)
    return {
      level: "Explorer",
      nextLevel: "Enthusiast",
      pointsNeeded: 500 - points,
    };
  if (points < 1500)
    return {
      level: "Enthusiast",
      nextLevel: "Expert",
      pointsNeeded: 1500 - points,
    };
  if (points < 5000)
    return {
      level: "Expert",
      nextLevel: "Master",
      pointsNeeded: 5000 - points,
    };
  return { level: "Master", nextLevel: null, pointsNeeded: 0 };
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ points: -1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update level based on points
userSchema.pre("save", function (next) {
  const levelInfo = this.levelInfo;
  this.level = levelInfo.level;
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add points method
userSchema.methods.addPoints = function (points, reason = "Activity") {
  this.points += points;

  // Create point transaction record
  const PointTransaction = mongoose.model("PointTransaction");
  const transaction = new PointTransaction({
    user: this._id,
    points,
    type: "earned",
    reason,
  });
  transaction.save();

  return this.save();
};

// Deduct points method
userSchema.methods.deductPoints = function (points, reason = "Purchase") {
  if (this.points < points) {
    throw new Error("Insufficient points");
  }

  this.points -= points;

  // Create point transaction record
  const PointTransaction = mongoose.model("PointTransaction");
  const transaction = new PointTransaction({
    user: this._id,
    points: -points,
    type: "spent",
    reason,
  });
  transaction.save();

  return this.save();
};

// Update last active
userSchema.methods.updateLastActive = function () {
  this.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
