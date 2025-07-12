const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          maxlength: [200, "Notes cannot exceed 200 characters"],
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ "items.item": 1 });

// Virtual for total items count
wishlistSchema.virtual("totalItems").get(function () {
  return this.items.length;
});

// Add item to wishlist
wishlistSchema.methods.addItem = function (itemId, notes = "") {
  const existingItem = this.items.find(
    (item) => item.item.toString() === itemId.toString(),
  );

  if (existingItem) {
    throw new Error("Item already in wishlist");
  }

  this.items.push({
    item: itemId,
    addedAt: new Date(),
    notes,
  });

  return this.save();
};

// Remove item from wishlist
wishlistSchema.methods.removeItem = function (itemId) {
  this.items = this.items.filter(
    (item) => item.item.toString() !== itemId.toString(),
  );
  return this.save();
};

// Check if item is in wishlist
wishlistSchema.methods.hasItem = function (itemId) {
  return this.items.some((item) => item.item.toString() === itemId.toString());
};

// Static method to find or create wishlist
wishlistSchema.statics.findOrCreate = async function (userId) {
  let wishlist = await this.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new this({ user: userId, items: [] });
    await wishlist.save();
  }

  return wishlist;
};

module.exports = mongoose.model("Wishlist", wishlistSchema);
