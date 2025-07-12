import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { itemsApi, authApi } from "@/lib/api";
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
    location: "Not set",
    joinDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "Recently",
    points: user?.points || 0,
    level: user?.level || "Beginner",
    totalListings: myItems.length,
    totalSales: myItems.filter((item: any) => item.status === "sold").length,
    totalPurchases: 0,
    rating: user?.rating?.average || 0,
    completedSwaps: 0,
  };

  // Fetch user's items
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyItems();
      setProfileData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: "",
      });
    }
  }, [isAuthenticated, user]);

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
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {userData.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {userData.name}!
                </h1>
                <p className="text-text-secondary">
                  Member since {userData.joinDate}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className="bg-primary">{userData.level}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">
                      {userData.rating || "No ratings yet"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Dialog
              open={isEditProfileOpen}
              onOpenChange={setIsEditProfileOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <Button onClick={handleProfileEdit} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <Recycle className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {userData.points}
              </div>
              <div className="text-sm text-text-muted">ReWear Points</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {userData.totalListings}
              </div>
              <div className="text-sm text-text-muted">Items Listed</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {userData.totalSales}
              </div>
              <div className="text-sm text-text-muted">Items Sold</div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {userData.totalPurchases}
              </div>
              <div className="text-sm text-text-muted">Purchases</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Points Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Level Progress</h3>
                <span className="text-sm text-text-muted">
                  {userData.points}/100 points to next level
                </span>
              </div>
              <Progress
                value={Math.min((userData.points / 100) * 100, 100)}
                className="w-full"
              />
              <p className="text-sm text-text-muted mt-2">
                Keep earning points by listing items and making swaps!
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* My Listings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">My Listings</CardTitle>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
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
                    <p>
                      No items listed yet. Start by listing your first item!
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => (window.location.href = "/sell")}
                    >
                      List an Item
                    </Button>
                  </div>
                ) : (
                  myItems.map((item: any, index: number) => (
                    <motion.div
                      key={item._id || item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="border border-border rounded-lg p-3 bg-surface cursor-pointer"
                    >
                      <div className="aspect-square bg-muted rounded-md mb-3 relative overflow-hidden">
                        <img
                          src={item.images?.[0]?.url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <Badge
                          className={`absolute top-2 right-2 text-xs ${
                            item.status === "approved" ||
                            item.status === "active"
                              ? "bg-green-500"
                              : item.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-foreground mb-1 text-sm">
                        {item.title}
                      </h4>
                      <p className="text-primary font-semibold mb-2">
                        ₹{item.price}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {item.views || 0}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {item.likes || 0}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
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
                  <Search className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myPurchases.length === 0 ? (
                  <div className="col-span-full text-center py-8 text-text-muted">
                    <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
                    <p>No purchases yet. Start browsing items!</p>
                    <Button
                      className="mt-4"
                      onClick={() => (window.location.href = "/browse")}
                    >
                      Browse Items
                    </Button>
                  </div>
                ) : (
                  myPurchases.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="border border-border rounded-lg p-4 bg-surface"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {item.title}
                          </h4>
                          <p className="text-primary font-semibold">
                            ₹{item.price}
                          </p>
                          <div className="text-xs text-text-muted">
                            <div>Seller: {item.seller}</div>
                            <div>
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
