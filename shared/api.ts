/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Admin API interfaces
 */
export interface AdminItem {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  size: string;
  color: string;
  condition: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  seller: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    rating: { average: number; count: number };
  };
  status: "pending" | "approved" | "rejected" | "active" | "sold" | "flagged";
  qualityBadge: "basic" | "medium" | "high" | "premium";
  views: number;
  likes: number;
  featured: boolean;
  createdAt: string;
  rejectionReason?: string;
  flaggedReasons?: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  points: number;
  level: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  totalItemsSold: number;
  totalItemsBought: number;
  rating: { average: number; count: number };
  createdAt: string;
  lastActive: string;
}

export interface ApproveItemRequest {
  itemId: string;
  qualityBadge?: "basic" | "medium" | "high" | "premium";
}

export interface RejectItemRequest {
  itemId: string;
  reason: string;
}

export interface GrantPointsRequest {
  userId: string;
  points: number;
  reason: string;
}

export interface UpdateQualityRequest {
  itemId: string;
  qualityBadge: "basic" | "medium" | "high" | "premium";
}

export interface ModerationActionRequest {
  itemId: string;
  action: "remove" | "restore";
  reason?: string;
}
