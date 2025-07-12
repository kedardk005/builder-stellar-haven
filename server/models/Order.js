const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
    itemPrice: {
      type: Number,
      required: true,
      min: [0, "Item price cannot be negative"],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, "Shipping cost cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["razorpay", "points", "cod"],
      default: "razorpay",
    },
    status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "disputed",
      ],
      default: "pending",
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      addressLine1: {
        type: String,
        required: true,
      },
      addressLine2: String,
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
    },
    // Payment tracking
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
    // Shipping tracking
    trackingNumber: String,
    shippedAt: Date,
    estimatedDelivery: Date,
    deliveredAt: Date,
    // Cancellation/Refund
    cancelledAt: Date,
    cancellationReason: String,
    refundedAt: Date,
    refundAmount: Number,
    refundReason: String,
    // Points transaction (if paid with points)
    pointsUsed: {
      type: Number,
      default: 0,
    },
    pointsEarned: {
      buyer: {
        type: Number,
        default: 0,
      },
      seller: {
        type: Number,
        default: 0,
      },
    },
    // Reviews
    buyerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      reviewedAt: Date,
    },
    sellerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
      reviewedAt: Date,
    },
    // Dispute handling
    disputeReason: String,
    disputeRaisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    disputeRaisedAt: Date,
    disputeResolvedAt: Date,
    disputeResolution: String,
    // Internal notes for admin
    adminNotes: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ item: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ razorpayOrderId: 1 });
orderSchema.index({ razorpayPaymentId: 1 });

// Virtual for order total with discounts
orderSchema.virtual("finalAmount").get(function () {
  return this.amount - this.discount;
});

// Virtual for order duration
orderSchema.virtual("orderAge").get(function () {
  return Date.now() - this.createdAt;
});

// Mark order as paid
orderSchema.methods.markAsPaid = function (paymentDetails = {}) {
  this.status = "paid";
  this.paidAt = new Date();

  if (paymentDetails.razorpayPaymentId) {
    this.razorpayPaymentId = paymentDetails.razorpayPaymentId;
  }
  if (paymentDetails.razorpaySignature) {
    this.razorpaySignature = paymentDetails.razorpaySignature;
  }

  return this.save();
};

// Mark order as shipped
orderSchema.methods.markAsShipped = function (
  trackingNumber,
  estimatedDelivery,
) {
  this.status = "shipped";
  this.shippedAt = new Date();
  this.trackingNumber = trackingNumber;
  if (estimatedDelivery) {
    this.estimatedDelivery = estimatedDelivery;
  }
  return this.save();
};

// Mark order as delivered
orderSchema.methods.markAsDelivered = function () {
  this.status = "delivered";
  this.deliveredAt = new Date();
  return this.save();
};

// Cancel order
orderSchema.methods.cancelOrder = function (reason) {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};

// Add buyer review
orderSchema.methods.addBuyerReview = function (rating, comment) {
  this.buyerReview = {
    rating,
    comment,
    reviewedAt: new Date(),
  };
  return this.save();
};

// Add seller review
orderSchema.methods.addSellerReview = function (rating, comment) {
  this.sellerReview = {
    rating,
    comment,
    reviewedAt: new Date(),
  };
  return this.save();
};

// Raise dispute
orderSchema.methods.raiseDispute = function (userId, reason) {
  this.status = "disputed";
  this.disputeReason = reason;
  this.disputeRaisedBy = userId;
  this.disputeRaisedAt = new Date();
  return this.save();
};

// Calculate platform fee (for future use)
orderSchema.methods.calculatePlatformFee = function (feePercentage = 5) {
  return (this.itemPrice * feePercentage) / 100;
};

// Pre-save middleware to update item status when order is paid
orderSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.status === "paid") {
    try {
      const Item = mongoose.model("Item");
      await Item.findByIdAndUpdate(this.item, {
        status: "sold",
        soldTo: this.buyer,
        soldAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating item status:", error);
    }
  }
  next();
});

// Post-save middleware to handle points allocation
orderSchema.post("save", async function () {
  if (this.status === "paid" && !this.pointsEarned.buyer) {
    try {
      const User = mongoose.model("User");

      // Award points to buyer (1% of amount spent)
      const buyerPoints = Math.floor(this.itemPrice * 0.01 * 100); // 1 point per rupee
      await User.findByIdAndUpdate(this.buyer, {
        $inc: { points: buyerPoints },
      });

      // Award points to seller (5% of amount earned)
      const sellerPoints = Math.floor(this.itemPrice * 0.05 * 100); // 5 points per rupee
      await User.findByIdAndUpdate(this.seller, {
        $inc: { points: sellerPoints, totalItemsSold: 1 },
      });

      // Update buyer's purchase count
      await User.findByIdAndUpdate(this.buyer, {
        $inc: { totalItemsBought: 1 },
      });

      // Update the points earned in this order
      this.pointsEarned = {
        buyer: buyerPoints,
        seller: sellerPoints,
      };
      await this.updateOne(
        { pointsEarned: this.pointsEarned },
        { timestamps: false },
      );
    } catch (error) {
      console.error("Error updating user points:", error);
    }
  }
});

module.exports = mongoose.model("Order", orderSchema);
