const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemSnapshot: {
      title: String,
      price: Number,
      images: [
        {
          url: String,
          isPrimary: Boolean,
        },
      ],
      condition: String,
      brand: String,
      size: String,
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "points", "mixed"],
      required: true,
    },
    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      pointsUsed: {
        type: Number,
        default: 0,
      },
      cashAmount: {
        type: Number,
        default: 0,
      },
    },
    pricing: {
      itemPrice: {
        type: Number,
        required: true,
      },
      shippingCost: {
        type: Number,
        required: true,
      },
      platformFee: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      pointsDiscount: {
        type: Number,
        default: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "India",
      },
      specialInstructions: String,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "payment_pending",
        "payment_failed",
        "confirmed",
        "processing",
        "shipped",
        "in_transit",
        "delivered",
        "cancelled",
        "refunded",
        "disputed",
      ],
      default: "pending",
    },
    trackingInfo: {
      trackingNumber: String,
      carrier: String,
      trackingUrl: String,
      estimatedDelivery: Date,
    },
    timeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    pointsAwarded: {
      buyer: {
        type: Number,
        default: 0,
      },
      seller: {
        type: Number,
        default: 0,
      },
    },
    rating: {
      byBuyer: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: Date,
      },
      bySeller: {
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: Date,
      },
    },
    notes: {
      buyer: String,
      seller: String,
      admin: String,
    },
    isGift: {
      type: Boolean,
      default: false,
    },
    giftMessage: String,
    cancellationReason: String,
    refundAmount: Number,
    refundedAt: Date,
    deliveredAt: Date,
    estimatedDeliveryDate: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ item: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "paymentDetails.razorpayOrderId": 1 });

// Generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    this.orderNumber = `RW${timestamp.slice(-8)}${randomSuffix}`;
  }
  next();
});

// Add status to timeline
orderSchema.methods.updateStatus = function (
  newStatus,
  note = "",
  updatedBy = null,
) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy,
  });

  // Set delivered date
  if (newStatus === "delivered") {
    this.deliveredAt = new Date();
  }

  return this.save();
};

// Calculate points to award
orderSchema.methods.calculatePointsToAward = function () {
  const basePoints = Math.floor(this.pricing.itemPrice * 0.05); // 5% of item price

  return {
    buyer: basePoints, // Points for buying
    seller: basePoints * 2, // More points for selling
  };
};

// Award points to buyer and seller
orderSchema.methods.awardPoints = async function () {
  if (this.pointsAwarded.buyer > 0 || this.pointsAwarded.seller > 0) {
    return; // Points already awarded
  }

  const pointsToAward = this.calculatePointsToAward();

  const User = mongoose.model("User");
  const buyer = await User.findById(this.buyer);
  const seller = await User.findById(this.seller);

  if (buyer) {
    await buyer.addPoints(
      pointsToAward.buyer,
      `Purchase order ${this.orderNumber}`,
    );
    this.pointsAwarded.buyer = pointsToAward.buyer;
  }

  if (seller) {
    await seller.addPoints(
      pointsToAward.seller,
      `Sale order ${this.orderNumber}`,
    );
    this.pointsAwarded.seller = pointsToAward.seller;
  }

  return this.save();
};

// Virtual for order age
orderSchema.virtual("orderAge").get(function () {
  const now = new Date();
  const ageInMs = now - this.createdAt;
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  return ageInDays;
});

// Virtual for current timeline status
orderSchema.virtual("currentTimeline").get(function () {
  return this.timeline[this.timeline.length - 1];
});

// Static method to get order statistics
orderSchema.statics.getOrderStats = function (userId, type = "buyer") {
  const matchField = type === "buyer" ? "buyer" : "seller";

  return this.aggregate([
    { $match: { [matchField]: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$pricing.totalAmount" },
      },
    },
  ]);
};

module.exports = mongoose.model("Order", orderSchema);
