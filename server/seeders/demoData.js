const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Item = require("../models/Item");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Wishlist = require("../models/Wishlist");
const PointTransaction = require("../models/PointTransaction");

// Demo Users Data
const demoUsers = [
  {
    name: "Demo Admin",
    email: "admin@demo.com",
    password: "demo123",
    phone: "+91-9876543210",
    role: "admin",
    points: 10000,
    level: "Master",
    isVerified: true,
    bio: "Demo admin account for testing and demonstration purposes",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "123 Admin Street",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      postalCode: "400001",
    },
    totalItemsSold: 25,
    totalItemsBought: 15,
    rating: { average: 4.8, count: 42 },
  },
  {
    name: "Emma Johnson",
    email: "emma@demo.com",
    password: "demo123",
    phone: "+91-9876543211",
    role: "user",
    points: 2500,
    level: "Expert",
    isVerified: true,
    bio: "Fashion enthusiast and sustainable living advocate. Love finding unique vintage pieces!",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "456 Green Avenue",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      postalCode: "110001",
    },
    totalItemsSold: 18,
    totalItemsBought: 22,
    rating: { average: 4.6, count: 35 },
  },
  {
    name: "Arjun Patel",
    email: "arjun@demo.com",
    password: "demo123",
    phone: "+91-9876543212",
    role: "user",
    points: 1800,
    level: "Enthusiast",
    isVerified: true,
    bio: "Sneaker collector and streetwear enthusiast. Always looking for limited edition pieces.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "789 Tech Park",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      postalCode: "560001",
    },
    totalItemsSold: 12,
    totalItemsBought: 28,
    rating: { average: 4.7, count: 28 },
  },
  {
    name: "Priya Singh",
    email: "priya@demo.com",
    password: "demo123",
    phone: "+91-9876543213",
    role: "user",
    points: 750,
    level: "Explorer",
    isVerified: true,
    bio: "Minimalist wardrobe curator. Passionate about quality over quantity.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "321 Peaceful Lane",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      postalCode: "411001",
    },
    totalItemsSold: 8,
    totalItemsBought: 15,
    rating: { average: 4.9, count: 18 },
  },
  {
    name: "Rahul Gupta",
    email: "rahul@demo.com",
    password: "demo123",
    phone: "+91-9876543214",
    role: "user",
    points: 320,
    level: "Explorer",
    isVerified: true,
    bio: "Formal wear specialist. Building a sustainable business wardrobe.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "654 Business District",
      city: "Gurgaon",
      state: "Haryana",
      country: "India",
      postalCode: "122001",
    },
    totalItemsSold: 5,
    totalItemsBought: 12,
    rating: { average: 4.5, count: 12 },
  },
  {
    name: "Ananya Sharma",
    email: "ananya@demo.com",
    password: "demo123",
    phone: "+91-9876543215",
    role: "user",
    points: 150,
    level: "Explorer",
    isVerified: true,
    bio: "New to sustainable fashion but excited to make a difference!",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    address: {
      street: "987 Student Area",
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      postalCode: "600001",
    },
    totalItemsSold: 2,
    totalItemsBought: 8,
    rating: { average: 4.8, count: 6 },
  },
];

// Demo Items Data
const demoItems = [
  {
    title: "Vintage Levi's 501 Jeans",
    description:
      "Classic Levi's 501 jeans in excellent condition. Perfect for creating timeless casual looks. These jeans have been loved but still have years of wear left in them.",
    category: "Bottoms",
    subCategory: "Jeans",
    brand: "Levi's",
    size: "M",
    color: "Blue",
    condition: "Excellent",
    conditionDescription: "Minor fading on knees which adds character",
    originalPrice: 4999,
    price: 2999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop",
        publicId: "demo_levis_jeans_1",
        isPrimary: true,
      },
    ],
    status: "active",
    tags: ["vintage", "classic", "denim", "casual"],
    materials: ["Cotton", "Elastane"],
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    views: 156,
    likes: 23,
  },
  {
    title: "Zara Floral Summer Dress",
    description:
      "Beautiful floral print summer dress from Zara. Perfect for brunches, dates, or casual outings. Only worn a few times, excellent condition.",
    category: "Dresses",
    subCategory: "Summer Dress",
    brand: "Zara",
    size: "S",
    color: "Floral",
    condition: "Like New",
    conditionDescription: "Worn only 2-3 times, no visible wear",
    originalPrice: 3999,
    price: 1999,
    images: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop",
        publicId: "demo_zara_dress_1",
        isPrimary: true,
      },
    ],
    status: "active",
    tags: ["floral", "summer", "casual", "feminine"],
    materials: ["Polyester", "Viscose"],
    location: { city: "Delhi", state: "Delhi", country: "India" },
    views: 89,
    likes: 15,
  },
  {
    title: "Nike Air Force 1 Sneakers",
    description:
      "Classic white Nike Air Force 1 sneakers. Some signs of wear but still in good condition. Great for casual everyday wear.",
    category: "Shoes",
    subCategory: "Sneakers",
    brand: "Nike",
    size: "9",
    color: "White",
    condition: "Good",
    conditionDescription:
      "Some creasing and minor scuffs, but structurally sound",
    originalPrice: 7999,
    price: 3499,
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop",
        publicId: "demo_nike_af1_1",
        isPrimary: true,
      },
    ],
    status: "active",
    tags: ["sneakers", "casual", "streetwear", "white"],
    materials: ["Leather", "Rubber"],
    location: { city: "Bangalore", state: "Karnataka", country: "India" },
    views: 234,
    likes: 42,
  },
  {
    title: "H&M Wool Blend Blazer",
    description:
      "Professional navy blue blazer from H&M. Perfect for office wear or formal occasions. Well-maintained and cleaned regularly.",
    category: "Formal",
    subCategory: "Blazer",
    brand: "H&M",
    size: "M",
    color: "Navy Blue",
    condition: "Excellent",
    conditionDescription:
      "Professional cleaning maintained, minor signs of wear on buttons",
    originalPrice: 4999,
    price: 2799,
    images: [
      {
        url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=600&fit=crop",
        publicId: "demo_hm_blazer_1",
        isPrimary: true,
      },
    ],
    status: "active",
    tags: ["formal", "professional", "blazer", "navy"],
    materials: ["Wool", "Polyester"],
    location: { city: "Pune", state: "Maharashtra", country: "India" },
    views: 67,
    likes: 8,
  },
  {
    title: "Adidas Track Jacket",
    description:
      "Vintage Adidas track jacket in black with white stripes. Great for workouts or casual streetwear. Classic design that never goes out of style.",
    category: "Activewear",
    subCategory: "Track Jacket",
    brand: "Adidas",
    size: "L",
    color: "Black",
    condition: "Good",
    conditionDescription:
      "Some pilling on inner lining, exterior in great shape",
    originalPrice: 3999,
    price: 1799,
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop",
        publicId: "demo_adidas_jacket_1",
        isPrimary: true,
      },
    ],
    status: "active",
    tags: ["activewear", "vintage", "streetwear", "casual"],
    materials: ["Polyester", "Cotton"],
    location: { city: "Gurgaon", state: "Haryana", country: "India" },
    views: 123,
    likes: 18,
  },
  {
    title: "Mango Leather Handbag",
    description:
      "Elegant brown leather handbag from Mango. Perfect size for daily use. Some minor scratches but overall excellent condition.",
    category: "Accessories",
    subCategory: "Handbag",
    brand: "Mango",
    size: "One Size",
    color: "Brown",
    condition: "Excellent",
    conditionDescription:
      "Minor scratches on bottom, hardware in perfect condition",
    originalPrice: 5999,
    price: 3299,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop",
        publicId: "demo_mango_bag_1",
        isPrimary: true,
      },
    ],
    status: "active",
    tags: ["accessories", "leather", "handbag", "everyday"],
    materials: ["Leather"],
    location: { city: "Chennai", state: "Tamil Nadu", country: "India" },
    views: 45,
    likes: 7,
  },
  {
    title: "Uniqlo Cotton T-Shirt",
    description:
      "High-quality cotton t-shirt from Uniqlo in classic white. Versatile piece that goes with everything. Excellent condition.",
    category: "Tops",
    subCategory: "T-Shirt",
    brand: "Uniqlo",
    size: "M",
    color: "White",
    condition: "Like New",
    conditionDescription: "Barely worn, no signs of wear or staining",
    originalPrice: 1499,
    price: 899,
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop",
        publicId: "demo_uniqlo_tshirt_1",
        isPrimary: true,
      },
    ],
    status: "active",
    tags: ["basics", "cotton", "casual", "versatile"],
    materials: ["Cotton"],
    location: { city: "Mumbai", state: "Maharashtra", country: "India" },
    views: 78,
    likes: 12,
  },
  {
    title: "Forever 21 Denim Jacket",
    description:
      "Classic denim jacket from Forever 21. Perfect for layering. Some signs of wear that add to the vintage appeal.",
    category: "Outerwear",
    subCategory: "Denim Jacket",
    brand: "Forever 21",
    size: "S",
    color: "Blue",
    condition: "Good",
    conditionDescription:
      "Intentional distressing, some fading that looks authentic",
    originalPrice: 2999,
    price: 1499,
    images: [
      {
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500&h=600&fit=crop",
        publicId: "demo_forever21_jacket_1",
        isPrimary: true,
      },
    ],
    status: "sold",
    tags: ["denim", "vintage", "layering", "casual"],
    materials: ["Cotton", "Polyester"],
    location: { city: "Delhi", state: "Delhi", country: "India" },
    views: 156,
    likes: 31,
  },
];

// Demo Orders Data
const demoOrders = [
  {
    amount: 1499,
    itemPrice: 1499,
    shippingCost: 0,
    paymentMethod: "razorpay",
    status: "delivered",
    shippingAddress: {
      fullName: "Arjun Patel",
      phone: "+91-9876543212",
      addressLine1: "789 Tech Park",
      city: "Bangalore",
      state: "Karnataka",
      postalCode: "560001",
      country: "India",
    },
    razorpayOrderId: "order_demo_001",
    razorpayPaymentId: "pay_demo_001",
    paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    shippedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    trackingNumber: "TRK001DEF456",
    pointsEarned: { buyer: 15, seller: 75 },
    buyerReview: {
      rating: 5,
      comment: "Great quality jacket! Exactly as described and fast delivery.",
      reviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    sellerReview: {
      rating: 5,
      comment: "Smooth transaction, prompt payment. Excellent buyer!",
      reviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
  },
  {
    amount: 2999,
    itemPrice: 2999,
    shippingCost: 0,
    paymentMethod: "razorpay",
    status: "shipped",
    shippingAddress: {
      fullName: "Priya Singh",
      phone: "+91-9876543213",
      addressLine1: "321 Peaceful Lane",
      city: "Pune",
      state: "Maharashtra",
      postalCode: "411001",
      country: "India",
    },
    razorpayOrderId: "order_demo_002",
    razorpayPaymentId: "pay_demo_002",
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    shippedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    trackingNumber: "TRK002GHI789",
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    pointsEarned: { buyer: 30, seller: 150 },
  },
  {
    amount: 1999,
    itemPrice: 1999,
    shippingCost: 0,
    paymentMethod: "razorpay",
    status: "processing",
    shippingAddress: {
      fullName: "Rahul Gupta",
      phone: "+91-9876543214",
      addressLine1: "654 Business District",
      city: "Gurgaon",
      state: "Haryana",
      postalCode: "122001",
      country: "India",
    },
    razorpayOrderId: "order_demo_003",
    razorpayPaymentId: "pay_demo_003",
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    pointsEarned: { buyer: 20, seller: 100 },
  },
];

// Demo Reviews Data
const demoReviews = [
  {
    rating: 5,
    title: "Excellent seller, highly recommended!",
    comment:
      "The denim jacket was exactly as described. Emma was very responsive and shipped quickly. The item was well packaged and arrived in perfect condition.",
    aspects: {
      communication: 5,
      itemCondition: 5,
      packaging: 5,
      delivery: 5,
      overall: 5,
    },
    type: "buyer_to_seller",
    isVerifiedPurchase: true,
    isHelpful: 3,
  },
  {
    rating: 5,
    title: "Great buyer experience",
    comment:
      "Quick payment and smooth transaction. Would definitely sell to Arjun again!",
    aspects: {
      communication: 5,
      itemCondition: 5,
      packaging: 5,
      delivery: 5,
      overall: 5,
    },
    type: "seller_to_buyer",
    isVerifiedPurchase: true,
    isHelpful: 2,
  },
  {
    rating: 4,
    title: "Good quality vintage jeans",
    comment:
      "Nice vintage Levi's jeans. The condition was as described, though there's a bit more fading than I expected. Still happy with the purchase!",
    aspects: {
      communication: 5,
      itemCondition: 4,
      packaging: 4,
      delivery: 4,
      overall: 4,
    },
    type: "buyer_to_seller",
    isVerifiedPurchase: true,
    isHelpful: 5,
  },
];

async function createDemoData() {
  try {
    console.log("🌱 Starting demo data seeding...");

    // Clear existing data (only for demo)
    await User.deleteMany({ email: { $regex: /@demo\.com$/ } });
    await Item.deleteMany({ seller: { $exists: true } });
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await PointTransaction.deleteMany({});

    console.log("🧹 Cleared existing demo data");

    // Create demo users
    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`👤 Created user: ${userData.name} (${userData.email})`);
    }

    // Create demo items
    const createdItems = [];
    for (let i = 0; i < demoItems.length; i++) {
      const itemData = demoItems[i];
      // Assign seller (skip admin user)
      const sellerIndex = (i % (createdUsers.length - 1)) + 1;
      itemData.seller = createdUsers[sellerIndex]._id;

      const item = new Item(itemData);
      await item.save();
      createdItems.push(item);
      console.log(`📦 Created item: ${itemData.title}`);
    }

    // Create demo orders
    const createdOrders = [];
    for (let i = 0; i < demoOrders.length; i++) {
      const orderData = demoOrders[i];
      // Find the sold item (Forever 21 Denim Jacket)
      const soldItem = createdItems.find((item) => item.status === "sold");

      if (i === 0 && soldItem) {
        // First order for the sold item
        orderData.item = soldItem._id;
        orderData.seller = soldItem.seller;
        orderData.buyer = createdUsers[2]._id; // Arjun
      } else {
        // Other orders for active items
        const availableItems = createdItems.filter(
          (item) => item.status === "active",
        );
        const randomItem = availableItems[i % availableItems.length];
        orderData.item = randomItem._id;
        orderData.seller = randomItem.seller;
        orderData.buyer = createdUsers[(i + 2) % createdUsers.length]._id;
      }

      const order = new Order(orderData);
      await order.save();
      createdOrders.push(order);
      console.log(`📋 Created order for ${orderData.amount}`);
    }

    // Create demo reviews
    for (let i = 0; i < demoReviews.length; i++) {
      const reviewData = demoReviews[i];
      const order = createdOrders[0]; // Use the first completed order

      reviewData.reviewer = order.buyer;
      reviewData.reviewee = order.seller;
      reviewData.item = order.item;
      reviewData.order = order._id;

      const review = new Review(reviewData);
      await review.save();
      console.log(`⭐ Created review: ${reviewData.title}`);
    }

    // Create demo wishlists
    for (let i = 1; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const wishlist = new Wishlist({ user: user._id, items: [] });

      // Add 2-3 random items to each wishlist
      const randomItems = createdItems
        .filter(
          (item) => item.status === "active" && !item.seller.equals(user._id),
        )
        .slice(0, Math.floor(Math.random() * 3) + 1);

      for (const item of randomItems) {
        wishlist.items.push({
          item: item._id,
          addedAt: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          ),
          notes: "Interested in this piece",
        });
      }

      await wishlist.save();
      console.log(`💖 Created wishlist for ${user.name}`);
    }

    // Create demo point transactions
    for (const user of createdUsers) {
      // Create some transaction history
      const transactions = [
        {
          user: user._id,
          points: 100,
          type: "bonus",
          reason: "Welcome bonus",
          balanceAfter: 100,
        },
        {
          user: user._id,
          points: 50,
          type: "earned",
          reason: "Item sold",
          balanceAfter: 150,
        },
        {
          user: user._id,
          points: -25,
          type: "spent",
          reason: "Discount used",
          balanceAfter: 125,
        },
      ];

      for (const transactionData of transactions) {
        const transaction = new PointTransaction(transactionData);
        await transaction.save();
      }

      console.log(`💰 Created point transactions for ${user.name}`);
    }

    console.log("✅ Demo data seeding completed successfully!");
    console.log("\n📝 Demo Accounts Created:");
    console.log("Admin: admin@demo.com / demo123");
    console.log(
      "Users: emma@demo.com, arjun@demo.com, priya@demo.com, rahul@demo.com, ananya@demo.com / demo123",
    );

    return {
      success: true,
      message: "Demo data created successfully",
      users: createdUsers.length,
      items: createdItems.length,
      orders: createdOrders.length,
      reviews: demoReviews.length,
    };
  } catch (error) {
    console.error("❌ Error creating demo data:", error);
    throw error;
  }
}

async function clearDemoData() {
  try {
    console.log("🧹 Clearing demo data...");

    await User.deleteMany({ email: { $regex: /@demo\.com$/ } });
    await Item.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Wishlist.deleteMany({});
    await PointTransaction.deleteMany({});

    console.log("✅ Demo data cleared successfully!");
    return { success: true, message: "Demo data cleared successfully" };
  } catch (error) {
    console.error("❌ Error clearing demo data:", error);
    throw error;
  }
}

module.exports = {
  createDemoData,
  clearDemoData,
  demoUsers,
  demoItems,
};
