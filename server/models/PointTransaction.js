const mongoose = require("mongoose");

const pointTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["earned", "spent", "bonus", "refund", "penalty"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      maxlength: [200, "Reason cannot exceed 200 characters"],
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    relatedOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      // Points expire after 2 years
      default: () => new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
pointTransactionSchema.index({ user: 1, createdAt: -1 });
pointTransactionSchema.index({ type: 1 });
pointTransactionSchema.index({ expiresAt: 1 });

// Virtual for transaction age
pointTransactionSchema.virtual("age").get(function () {
  const now = new Date();
  const ageInMs = now - this.createdAt;
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  return ageInDays;
});

// Static method to get user's point history
pointTransactionSchema.statics.getUserPointHistory = function (
  userId,
  limit = 50,
  offset = 0,
) {
  return this.find({ user: userId, isVisible: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .populate("relatedItem", "title images.url")
    .populate("relatedOrder", "orderNumber");
};

// Static method to get point statistics
pointTransactionSchema.statics.getPointStats = function (userId) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$type",
        totalPoints: { $sum: "$points" },
        count: { $sum: 1 },
      },
    },
  ]);
};

module.exports = mongoose.model("PointTransaction", pointTransactionSchema);
