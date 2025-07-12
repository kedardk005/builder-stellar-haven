import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { adminApi, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  CheckCircle,
  XCircle,
  Star,
  Gift,
  Flag,
  Eye,
  Heart,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Award,
  Trash2,
  Edit,
  Ban,
  Unlock,
  RefreshCw,
} from "lucide-react";

interface Item {
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

interface User {
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

// Real data state management
interface AdminStats {
  pendingItems: number;
  flaggedItems: number;
  activeUsers: number;
  totalItems: number;
  totalUsers: number;
  soldItems: number;
  revenue: number;
  activeItems: number;
  approvedItems: number;
  rejectedItems: number;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [flaggedItems, setFlaggedItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState({
    pending: false,
    flagged: false,
    users: false,
    stats: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [customPoints, setCustomPoints] = useState("");
  const [pointsReason, setPointsReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // Check admin access
  const isAdmin = user?.role === "admin" || user?.email?.includes("admin");

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      setLoading((prev) => ({ ...prev, stats: true }));
      const response = await adminApi.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch admin statistics",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  };

  // Fetch pending items
  const fetchPendingItems = async () => {
    try {
      setLoading((prev) => ({ ...prev, pending: true }));
      const response = await adminApi.getPendingItems();
      if (response.success) {
        setPendingItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching pending items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pending items",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, pending: false }));
    }
  };

  // Fetch flagged items
  const fetchFlaggedItems = async () => {
    try {
      setLoading((prev) => ({ ...prev, flagged: true }));
      const response = await adminApi.getFlaggedItems();
      if (response.success) {
        setFlaggedItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching flagged items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch flagged items",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, flagged: false }));
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading((prev) => ({ ...prev, users: true }));
      const response = await adminApi.getUsers({ search: searchTerm });
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Load initial data
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchPendingItems();
      fetchFlaggedItems();
      fetchUsers();
    }
  }, [isAdmin]);

  // Refetch users when search term changes
  useEffect(() => {
    if (isAdmin && searchTerm !== undefined) {
      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 500); // Debounce search
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-destructive mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleApproveItem = async (itemId: string, qualityBadge?: string) => {
    try {
      const response = await adminApi.approveItem(itemId, qualityBadge);
      if (response.success) {
        setPendingItems((items) => items.filter((item) => item.id !== itemId));
        // Refresh stats
        fetchStats();
        toast({
          title: "Item Approved",
          description:
            "The item has been approved and is now live on the platform.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof ApiError ? error.message : "Failed to approve item",
        variant: "destructive",
      });
    }
  };

  const handleRejectItem = async (itemId: string, reason: string) => {
    try {
      const response = await adminApi.rejectItem(itemId, reason);
      if (response.success) {
        setPendingItems((items) => items.filter((item) => item.id !== itemId));
        // Refresh stats
        fetchStats();
        toast({
          title: "Item Rejected",
          description:
            "The item has been rejected and the seller has been notified.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof ApiError ? error.message : "Failed to reject item",
        variant: "destructive",
      });
    }
  };

  const handleMarkQuality = async (
    itemId: string,
    quality: "basic" | "medium" | "high" | "premium",
  ) => {
    try {
      const response = await adminApi.updateQuality(itemId, quality);
      if (response.success) {
        setPendingItems((items) =>
          items.map((item) =>
            item.id === itemId ? { ...item, qualityBadge: quality } : item,
          ),
        );
        toast({
          title: "Quality Updated",
          description: `Item quality has been marked as ${quality}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof ApiError
            ? error.message
            : "Failed to update quality",
        variant: "destructive",
      });
    }
  };

  const handleGrantPoints = async () => {
    if (!selectedUserId || !customPoints || !pointsReason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to grant points.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await adminApi.grantPoints(
        selectedUserId,
        parseInt(customPoints),
        pointsReason,
      );
      if (response.success) {
        setUsers((users) =>
          users.map((user) =>
            user.id === selectedUserId
              ? { ...user, points: user.points + parseInt(customPoints) }
              : user,
          ),
        );

        toast({
          title: "Points Granted",
          description: `${customPoints} points have been granted to ${response.data.user.name}.`,
        });

        setCustomPoints("");
        setPointsReason("");
        setSelectedUserId("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof ApiError ? error.message : "Failed to grant points",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFlaggedContent = async (itemId: string) => {
    try {
      const response = await adminApi.moderateContent(itemId, "remove");
      if (response.success) {
        setFlaggedItems((items) => items.filter((item) => item.id !== itemId));
        // Refresh stats
        fetchStats();
        toast({
          title: "Content Removed",
          description:
            "The inappropriate content has been removed from the platform.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof ApiError
            ? error.message
            : "Failed to remove content",
        variant: "destructive",
      });
    }
  };

  const handleRestoreContent = async (itemId: string) => {
    try {
      const response = await adminApi.moderateContent(itemId, "restore");
      if (response.success) {
        setFlaggedItems((items) => items.filter((item) => item.id !== itemId));
        // Refresh stats
        fetchStats();
        toast({
          title: "Content Restored",
          description:
            "The content has been reviewed and restored to the platform.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof ApiError
            ? error.message
            : "Failed to restore content",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-text-secondary">
            Manage items, users, and platform content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Items
              </CardTitle>
              <Clock className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading.stats ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  stats?.pendingItems || 0
                )}
              </div>
              <p className="text-xs text-text-muted">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Flagged Content
              </CardTitle>
              <Flag className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {loading.stats ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  stats?.flaggedItems || 0
                )}
              </div>
              <p className="text-xs text-text-muted">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading.stats ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  stats?.activeUsers || 0
                )}
              </div>
              <p className="text-xs text-text-muted">Online today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading.stats ? (
                  <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  stats?.totalItems || 0
                )}
              </div>
              <p className="text-xs text-text-muted">Total items</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
            <TabsTrigger value="rewards">Points & Rewards</TabsTrigger>
            <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          </TabsList>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Items Awaiting Approval</CardTitle>
                <CardDescription>
                  Review and approve or reject submitted items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.images[0]?.url}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-text-secondary">
                                {item.brand} • {item.size} • {item.condition}
                              </p>
                              <p className="text-sm text-text-muted mt-1">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">${item.price}</Badge>
                                <Badge variant="secondary">
                                  {item.category}
                                </Badge>
                                <Badge
                                  variant={
                                    item.qualityBadge === "premium"
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {item.qualityBadge}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleApproveItem(item.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Reject Item
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this item?
                                      Please provide a reason.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <Textarea placeholder="Reason for rejection..." />
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRejectItem(
                                          item.id,
                                          "Quality issues",
                                        )
                                      }
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Reject Item
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={item.seller.avatar} />
                                <AvatarFallback>
                                  {item.seller.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              {item.seller.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              {item.seller.rating.average} (
                              {item.seller.rating.count})
                            </div>
                            <span>
                              Submitted{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingItems.length === 0 && (
                    <div className="text-center py-8 text-text-muted">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No items pending approval</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Control Tab */}
          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Control</CardTitle>
                <CardDescription>
                  Mark high-quality uploads and assign quality badges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.images[0]?.url}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-text-secondary">
                            {item.brand} • {item.condition}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm">Quality Badge:</span>
                            <div className="flex gap-2">
                              {(
                                ["basic", "medium", "high", "premium"] as const
                              ).map((quality) => (
                                <Button
                                  key={quality}
                                  variant={
                                    item.qualityBadge === quality
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    handleMarkQuality(item.id, quality)
                                  }
                                >
                                  {quality === "premium" && (
                                    <Award className="h-3 w-3 mr-1" />
                                  )}
                                  {quality.charAt(0).toUpperCase() +
                                    quality.slice(1)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingItems.length === 0 && (
                    <div className="text-center py-8 text-text-muted">
                      <Award className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <p>No items available for quality review</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Points & Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grant Custom Points</CardTitle>
                  <CardDescription>
                    Award points to users for special achievements or
                    contributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="user-select">Select User</Label>
                    <Select
                      value={selectedUserId}
                      onValueChange={setSelectedUserId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              {user.name} ({user.points} pts)
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="points">Points to Award</Label>
                    <Input
                      id="points"
                      type="number"
                      placeholder="Enter points amount"
                      value={customPoints}
                      onChange={(e) => setCustomPoints(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Reason for awarding points..."
                      value={pointsReason}
                      onChange={(e) => setPointsReason(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleGrantPoints} className="w-full">
                    <Gift className="h-4 w-4 mr-2" />
                    Grant Points
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage user accounts and their points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-text-muted">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary">
                                {user.points} pts
                              </Badge>
                              <p className="text-xs text-text-muted mt-1">
                                {user.level}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Content</CardTitle>
                <CardDescription>
                  Review and manage inappropriate or reported content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-destructive/20 rounded-lg p-4 bg-destructive/5"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.images[0]?.url}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-text-secondary">
                                {item.brand} • {item.size}
                              </p>
                              <p className="text-sm text-text-muted mt-1">
                                {item.description}
                              </p>
                              {item.flaggedReasons && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-destructive">
                                    Flagged for:
                                  </p>
                                  <div className="flex gap-1 mt-1">
                                    {item.flaggedReasons.map(
                                      (reason, index) => (
                                        <Badge
                                          key={index}
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          {reason}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleRestoreContent(item.id)}
                                variant="outline"
                                size="sm"
                              >
                                <Unlock className="h-4 w-4 mr-1" />
                                Restore
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Remove Content
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to permanently
                                      remove this content? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleRemoveFlaggedContent(item.id)
                                      }
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Remove Content
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={item.seller.avatar} />
                                <AvatarFallback>
                                  {item.seller.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              {item.seller.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {item.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {item.likes}
                            </div>
                            <span>
                              Flagged{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {flaggedItems.length === 0 && (
                    <div className="text-center py-8 text-text-muted">
                      <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>No flagged content to review</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
