import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { itemsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  MapPin,
  Calendar,
  Recycle,
  Star,
  Heart,
  ShoppingBag,
  Package,
  TrendingUp,
  Award,
  Edit,
  Eye,
  Search,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: "",
  });

  // Real user data from auth context
  const userData = {
    name: user?.name || "User",
    email: user?.email || "",
    phone: user?.phone || "",
    location: "Not set", // Add location to user profile later
    joinDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "Recently",
    points: user?.points || 0,
    level: user?.level || "Beginner",
    totalListings: user?.totalItemsSold || 0,
    totalSales: user?.totalItemsSold || 0,
    totalPurchases: user?.totalItemsBought || 0,
    rating: user?.rating?.average || 0,
    completedSwaps: 0, // Add to user data later
  };

  // Fetch user's items
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyItems();
    }
  }, [isAuthenticated]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const response = await itemsApi.getMyItems();
      if (response.success) {
        setMyItems(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle profile edit
  const handleProfileEdit = async () => {
    try {
      // In a real app, this would call an API to update profile
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
      setIsEditProfileOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  // Mock purchases data
    // For now, no purchases data - can be added later
  const myPurchases = [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Dashboard
              </h1>
              <p className="text-text-secondary">
                Manage your ReWear profile and activities
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search your items..."
                className="pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent w-64"
              />
            </div>
          </div>
        </motion.div>

        {/* Profile Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Avatar & Basic Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-foreground">
                      {userData.name}
                    </h2>
                    <p className="text-text-secondary text-sm flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {userData.location}
                    </p>
                    <p className="text-text-secondary text-sm flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Member since {userData.joinDate}
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Recycle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {userData.points}
                    </div>
                    <div className="text-xs text-text-muted">ReWear Points</div>
                  </div>
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {userData.totalListings}
                    </div>
                    <div className="text-xs text-text-muted">Items Listed</div>
                  </div>
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {userData.totalPurchases}
                    </div>
                    <div className="text-xs text-text-muted">Purchases</div>
                  </div>
                  <div className="text-center p-3 bg-surface rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {userData.rating}
                    </div>
                    <div className="text-xs text-text-muted">Rating</div>
                  </div>
                </div>

                {/* Level & Progress */}
                <div className="lg:w-64 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary text-primary-foreground">
                      <Award className="h-3 w-3 mr-1" />
                      {userData.level}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Profile
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        Progress to next level
                      </span>
                      <span className="text-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-text-muted">
                      25 more points to reach "Sustainability Champion"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Listings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">My Listings</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                  <div className="col-span-full flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : myItems.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-text-muted">
                    <Package className="h-12 w-12 mx-auto mb-4" />
                    <p>No items listed yet. Start by listing your first item!</p>
                  </div>
                ) : (
                  myItems.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-border rounded-lg p-3 bg-surface cursor-pointer"
                  >
                    <div className="aspect-square bg-muted rounded-md mb-3 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML =
                            '<div class="w-full h-full flex items-center justify-center text-text-muted text-xs">No Image</div>';
                        }}
                      />
                      <Badge
                        className={`absolute top-2 right-2 text-xs ${
                          item.status === "Active"
                            ? "bg-green-500"
                            : item.status === "Sold"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-2 truncate">
                      {item.title}
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-foreground">
                        ₹{item.price}
                      </span>
                      <span className="text-xs text-text-muted flex items-center">
                        <Recycle className="h-3 w-3 mr-1" />
                        {item.points} pts
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-text-muted">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {item.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {item.likes}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Purchases Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">My Purchases</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {myPurchases.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-border rounded-lg p-3 bg-surface cursor-pointer"
                  >
                    <div className="aspect-square bg-muted rounded-md mb-3 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML =
                            '<div class="w-full h-full flex items-center justify-center text-text-muted text-xs">No Image</div>';
                        }}
                      />
                      <Badge
                        className={`absolute top-2 right-2 text-xs ${
                          item.status === "Delivered"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-2 truncate">
                      {item.title}
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-foreground">
                        ₹{item.price}
                      </span>
                      <span className="text-xs text-text-muted flex items-center">
                        <Recycle className="h-3 w-3 mr-1" />
                        {item.points} pts
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">
                      <div>Seller: {item.seller}</div>
                      <div>{new Date(item.date).toLocaleDateString()}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;