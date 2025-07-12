import { RequestHandler } from "express";
import {
  AdminItem,
  AdminUser,
  ApproveItemRequest,
  RejectItemRequest,
  GrantPointsRequest,
  UpdateQualityRequest,
  ModerationActionRequest,
} from "@shared/api";

// Mock data - In a real app, this would come from database
const mockPendingItems: AdminItem[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    description:
      "Classic blue denim jacket in excellent condition. Barely worn, from a smoke-free home.",
    category: "Outerwear",
    brand: "Levi's",
    size: "M",
    color: "Blue",
    condition: "Excellent",
    price: 85,
    originalPrice: 120,
    images: [{ url: "/placeholder.svg", isPrimary: true }],
    seller: {
      id: "u1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg",
      rating: { average: 4.8, count: 24 },
    },
    status: "pending",
    qualityBadge: "high",
    views: 0,
    likes: 0,
    featured: false,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Designer Evening Dress",
    description:
      "Stunning black cocktail dress, perfect for special occasions. Only worn once to a wedding.",
    category: "Dresses",
    brand: "Zara",
    size: "S",
    color: "Black",
    condition: "Like New",
    price: 150,
    originalPrice: 250,
    images: [{ url: "/placeholder.svg", isPrimary: true }],
    seller: {
      id: "u2",
      name: "Emma Wilson",
      email: "emma@example.com",
      rating: { average: 4.9, count: 18 },
    },
    status: "pending",
    qualityBadge: "premium",
    views: 0,
    likes: 0,
    featured: false,
    createdAt: "2024-01-15T14:20:00Z",
  },
];

const mockFlaggedItems: AdminItem[] = [
  {
    id: "3",
    title: "Inappropriate Content Item",
    description:
      "This item has been flagged for review due to inappropriate content or policy violation.",
    category: "Tops",
    brand: "Unknown",
    size: "M",
    color: "Red",
    condition: "Good",
    price: 45,
    images: [{ url: "/placeholder.svg", isPrimary: true }],
    seller: {
      id: "u3",
      name: "Flagged User",
      email: "flagged@example.com",
      rating: { average: 3.2, count: 5 },
    },
    status: "flagged",
    qualityBadge: "basic",
    views: 12,
    likes: 2,
    featured: false,
    createdAt: "2024-01-14T16:45:00Z",
    flaggedReasons: ["Inappropriate images", "Misleading description"],
  },
];

const mockUsers: AdminUser[] = [
  {
    id: "u1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    points: 1250,
    level: "Enthusiast",
    avatar: "/placeholder.svg",
    isActive: true,
    isVerified: true,
    totalItemsSold: 15,
    totalItemsBought: 8,
    rating: { average: 4.8, count: 24 },
    createdAt: "2023-06-15T10:30:00Z",
    lastActive: "2024-01-15T10:30:00Z",
  },
  {
    id: "u2",
    name: "Emma Wilson",
    email: "emma@example.com",
    points: 850,
    level: "Explorer",
    isActive: true,
    isVerified: false,
    totalItemsSold: 8,
    totalItemsBought: 12,
    rating: { average: 4.9, count: 18 },
    createdAt: "2023-08-20T14:20:00Z",
    lastActive: "2024-01-15T14:20:00Z",
  },
];

// Get pending items for approval
export const getPendingItems: RequestHandler = (req, res) => {
  res.json({
    success: true,
    data: mockPendingItems,
    total: mockPendingItems.length,
  });
};

// Get flagged items for moderation
export const getFlaggedItems: RequestHandler = (req, res) => {
  res.json({
    success: true,
    data: mockFlaggedItems,
    total: mockFlaggedItems.length,
  });
};

// Get users for management
export const getUsers: RequestHandler = (req, res) => {
  const { search, limit = 10, offset = 0 } = req.query;
  let filteredUsers = mockUsers;

  if (search) {
    const searchTerm = (search as string).toLowerCase();
    filteredUsers = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm),
    );
  }

  const paginatedUsers = filteredUsers.slice(
    Number(offset),
    Number(offset) + Number(limit),
  );

  res.json({
    success: true,
    data: paginatedUsers,
    total: filteredUsers.length,
  });
};

// Approve an item
export const approveItem: RequestHandler = (req, res) => {
  const { itemId, qualityBadge } = req.body as ApproveItemRequest;

  const itemIndex = mockPendingItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  // Remove from pending items (simulate approval)
  const approvedItem = mockPendingItems.splice(itemIndex, 1)[0];
  approvedItem.status = "approved";
  if (qualityBadge) {
    approvedItem.qualityBadge = qualityBadge;
  }

  res.json({
    success: true,
    message: "Item approved successfully",
    data: approvedItem,
  });
};

// Reject an item
export const rejectItem: RequestHandler = (req, res) => {
  const { itemId, reason } = req.body as RejectItemRequest;

  const itemIndex = mockPendingItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  // Remove from pending items (simulate rejection)
  const rejectedItem = mockPendingItems.splice(itemIndex, 1)[0];
  rejectedItem.status = "rejected";
  rejectedItem.rejectionReason = reason;

  res.json({
    success: true,
    message: "Item rejected successfully",
    data: rejectedItem,
  });
};

// Update item quality badge
export const updateQuality: RequestHandler = (req, res) => {
  const { itemId, qualityBadge } = req.body as UpdateQualityRequest;

  const item = mockPendingItems.find((item) => item.id === itemId);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  item.qualityBadge = qualityBadge;

  res.json({
    success: true,
    message: "Quality badge updated successfully",
    data: item,
  });
};

// Grant points to user
export const grantPoints: RequestHandler = (req, res) => {
  const { userId, points, reason } = req.body as GrantPointsRequest;

  const user = mockUsers.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.points += points;

  res.json({
    success: true,
    message: `${points} points granted to ${user.name}`,
    data: user,
  });
};

// Handle moderation actions
export const moderateContent: RequestHandler = (req, res) => {
  const { itemId, action, reason } = req.body as ModerationActionRequest;

  const itemIndex = mockFlaggedItems.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Flagged item not found",
    });
  }

  const item = mockFlaggedItems[itemIndex];

  if (action === "remove") {
    // Remove the item
    mockFlaggedItems.splice(itemIndex, 1);
    res.json({
      success: true,
      message: "Content removed successfully",
    });
  } else if (action === "restore") {
    // Restore the item
    item.status = "active";
    item.flaggedReasons = undefined;
    mockFlaggedItems.splice(itemIndex, 1);
    res.json({
      success: true,
      message: "Content restored successfully",
      data: item,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid action",
    });
  }
};

// Get admin dashboard stats
export const getAdminStats: RequestHandler = (req, res) => {
  const stats = {
    pendingItems: mockPendingItems.length,
    flaggedItems: mockFlaggedItems.length,
    activeUsers: mockUsers.filter((u) => u.isActive).length,
    totalItems: 1247, // Mock total
    totalUsers: mockUsers.length,
    totalSales: 3250, // Mock total
    revenue: 15750, // Mock revenue
  };

  res.json({
    success: true,
    data: stats,
  });
};
