const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Item title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
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
      ],
    },
    subCategory: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "Size is required"],
      enum: [
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
      ],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["Like New", "Excellent", "Good", "Fair"],
    },
    conditionDescription: {
      type: String,
      maxlength: [500, "Condition description cannot exceed 500 characters"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    pointsValue: {
      type: Number,
      default: function () {
        return Math.floor(this.price * 0.1); // 10% of price in points
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "active",
        "sold",
        "reserved",
        "draft",
        "inactive",
        "flagged",
      ],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: Date,
    rejectionReason: String,
    flaggedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
        flaggedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPromoted: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    materials: [
      {
        type: String,
        trim: true,
      },
    ],
    measurements: {
      chest: Number,
      waist: Number,
      hips: Number,
      length: Number,
      shoulders: Number,
      sleeves: Number,
    },
    shippingInfo: {
      weight: {
        type: Number,
        min: [0, "Weight cannot be negative"],
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
      },
      shippingCost: {
        type: Number,
        default: 50,
        min: [0, "Shipping cost cannot be negative"],
      },
      freeShippingThreshold: {
        type: Number,
        default: 500,
      },
    },
    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    qualityBadge: {
      type: String,
      enum: ["premium", "high", "medium", "basic"],
      default: function () {
        const conditionMap = {
          "Like New": "premium",
          Excellent: "high",
          Good: "medium",
          Fair: "basic",
        };
        return conditionMap[this.condition] || "medium";
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: Date,
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    soldAt: Date,
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reservedUntil: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ seller: 1, status: 1 });
itemSchema.index({ price: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ views: -1 });
itemSchema.index({ likes: -1 });
itemSchema.index({ "rating.average": -1 });
itemSchema.index({ tags: 1 });
itemSchema.index({ brand: 1 });

// Virtual for discount percentage
itemSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100,
    );
  }
  return 0;
});

// Virtual for shipping calculation
itemSchema.virtual("finalShippingCost").get(function () {
  if (this.price >= this.shippingInfo.freeShippingThreshold) {
    return 0;
  }
  return this.shippingInfo.shippingCost;
});

// Update views count
itemSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Toggle like
itemSchema.methods.toggleLike = function (userId) {
  const isLiked = this.likedBy.includes(userId);

  if (isLiked) {
    this.likedBy.pull(userId);
    this.likes = Math.max(0, this.likes - 1);
  } else {
    this.likedBy.push(userId);
    this.likes += 1;
  }

  return this.save();
};

// Mark as sold
itemSchema.methods.markAsSold = function (buyerId) {
  this.status = "sold";
  this.soldTo = buyerId;
  this.soldAt = new Date();
  this.reservedBy = undefined;
  this.reservedUntil = undefined;
  return this.save();
};

// Approve item
itemSchema.methods.approveItem = function (adminId, qualityBadge) {
  this.status = "approved";
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  if (qualityBadge) {
    this.qualityBadge = qualityBadge;
  }
  return this.save();
};

// Reject item
itemSchema.methods.rejectItem = function (adminId, reason) {
  this.status = "rejected";
  this.rejectedBy = adminId;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

// Flag item
itemSchema.methods.flagItem = function (userId, reason) {
  const existingFlag = this.flaggedBy.find(
    (flag) => flag.user.toString() === userId.toString(),
  );
  if (!existingFlag) {
    this.flaggedBy.push({
      user: userId,
      reason: reason,
      flaggedAt: new Date(),
    });
    if (this.flaggedBy.length >= 3) {
      this.status = "flagged";
    }
  }
  return this.save();
};

// Activate approved item
itemSchema.methods.activateItem = function () {
  if (this.status === "approved") {
    this.status = "active";
    return this.save();
  }
  throw new Error("Item must be approved before activation");
};

// Reserve item
itemSchema.methods.reserveItem = function (userId, minutes = 15) {
  this.status = "reserved";
  this.reservedBy = userId;
  this.reservedUntil = new Date(Date.now() + minutes * 60 * 1000);
  return this.save();
};

// Check if reservation expired
itemSchema.methods.checkReservation = function () {
  if (this.status === "reserved" && this.reservedUntil < new Date()) {
    this.status = "active";
    this.reservedBy = undefined;
    this.reservedUntil = undefined;
    return this.save();
  }
  return Promise.resolve(this);
};

// Pre-save middleware to set primary image
itemSchema.pre("save", function (next) {
  if (this.images && this.images.length > 0) {
    // Ensure at least one image is marked as primary
    const hasPrimary = this.images.some((img) => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Pre-save middleware to update quality badge
itemSchema.pre("save", function (next) {
  if (this.isModified("condition")) {
    const conditionMap = {
      "Like New": "premium",
      Excellent: "high",
      Good: "medium",
      Fair: "basic",
    };
    this.qualityBadge = conditionMap[this.condition] || "medium";
  }
  next();
});

module.exports = mongoose.model("Item", itemSchema);
