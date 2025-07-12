const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    type: {
      type: String,
      enum: ["buyer_to_seller", "seller_to_buyer"],
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      required: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    aspects: {
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      itemCondition: {
        type: Number,
        min: 1,
        max: 5,
      },
      packaging: {
        type: Number,
        min: 1,
        max: 5,
      },
      delivery: {
        type: Number,
        min: 1,
        max: 5,
      },
      overall: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    images: [
      {
        url: String,
        publicId: String,
        caption: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
    isHelpful: {
      type: Number,
      default: 0,
    },
    helpfulVotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        helpful: {
          type: Boolean,
          required: true,
        },
        votedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    response: {
      comment: String,
      respondedAt: Date,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    status: {
      type: String,
      enum: ["active", "hidden", "flagged", "deleted"],
      default: "active",
    },
    flaggedReason: String,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moderatedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
reviewSchema.index({ reviewee: 1, createdAt: -1 });
reviewSchema.index({ item: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });
reviewSchema.index({ order: 1 });
reviewSchema.index({ rating: -1 });

// Virtual for review age
reviewSchema.virtual("age").get(function () {
  const now = new Date();
  const ageInMs = now - this.createdAt;
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  return ageInDays;
});

// Add helpful vote
reviewSchema.methods.addHelpfulVote = function (userId, helpful) {
  // Remove existing vote if any
  this.helpfulVotes = this.helpfulVotes.filter(
    (vote) => vote.user.toString() !== userId.toString(),
  );

  // Add new vote
  this.helpfulVotes.push({
    user: userId,
    helpful,
    votedAt: new Date(),
  });

  // Update helpful count
  this.isHelpful = this.helpfulVotes.filter((vote) => vote.helpful).length;

  return this.save();
};

// Add response
reviewSchema.methods.addResponse = function (responderId, comment) {
  this.response = {
    comment,
    respondedAt: new Date(),
    respondedBy: responderId,
  };

  return this.save();
};

// Static method to get user's average rating
reviewSchema.statics.getUserAverageRating = async function (userId) {
  const result = await this.aggregate([
    {
      $match: {
        reviewee: mongoose.Types.ObjectId(userId),
        status: "active",
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const data = result[0];
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  data.ratingDistribution.forEach((rating) => {
    distribution[rating] = (distribution[rating] || 0) + 1;
  });

  return {
    averageRating: Math.round(data.averageRating * 10) / 10,
    totalReviews: data.totalReviews,
    ratingDistribution: distribution,
  };
};

// Static method to get item reviews
reviewSchema.statics.getItemReviews = function (itemId, limit = 10, skip = 0) {
  return this.find({ item: itemId, status: "active" })
    .populate("reviewer", "name avatar")
    .populate("response.respondedBy", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

module.exports = mongoose.model("Review", reviewSchema);
