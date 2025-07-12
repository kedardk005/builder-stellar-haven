import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { itemsApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Calendar,
  Package,
  Shield,
  Recycle,
  MessageCircle,
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ShoppingCart,
  ArrowLeftRight,
  Eye,
  Flag,
  ArrowRightLeft,
  Coins,
  CreditCard,
  Gift,
  DollarSign,
} from "lucide-react";

interface ProductData {
  _id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  size: string;
  color: string;
  condition: string;
  price: number;
  originalPrice?: number;
  pointsValue: number;
  swapValue: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  seller: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    rating: { average: number; count: number };
    createdAt: string;
  };
  status: string;
  qualityBadge: string;
  views: number;
  likes: number;
  likedBy: string[];
  featured: boolean;
  createdAt: string;
  tags?: string[];
  swapEnabled: boolean;
  pointsEnabled: boolean;
  purchaseEnabled: boolean;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    shoulders?: number;
    sleeves?: number;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [similarProducts, setSimilarProducts] = useState<ProductData[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);

  // Fetch product data
  const fetchProduct = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await itemsApi.getItem(id);
      if (response.success) {
        setProduct(response.data);
        setIsLiked(user ? response.data.likedBy?.includes(user.id) : false);

        // Fetch similar products
        const similarResponse = await itemsApi.getItems({
          category: response.data.category,
          limit: 4,
        });
        if (similarResponse.success) {
          // Filter out current product and limit to 4
          const filtered = similarResponse.data
            .filter((item) => item._id !== id)
            .slice(0, 4);
          setSimilarProducts(filtered);
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to fetch product";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike
  const handleLike = async () => {
    if (!isAuthenticated || !product) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like items",
        variant: "destructive",
      });
      return;
    }

    try {
      await itemsApi.likeItem(product._id);
      setIsLiked(!isLiked);
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              likes: isLiked ? prev.likes - 1 : prev.likes + 1,
            }
          : null,
      );
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  // Handle swap request
  const handleSwapRequest = async () => {
    if (!isAuthenticated || !product) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request swaps",
        variant: "destructive",
      });
      return;
    }

    if (product.seller._id === user?.id) {
      toast({
        title: "Cannot Swap",
        description: "You cannot swap with your own item",
        variant: "destructive",
      });
      return;
    }

    try {
      setOrderLoading(true);
      const response = await itemsApi.requestSwap(product._id, {
        message: "I'd like to swap for this item!",
      });

      if (response.success) {
        toast({
          title: "Swap Request Sent! 🔄",
          description: "The seller will be notified of your swap request.",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to send swap request";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  // Handle points redemption
  const handlePointsRedemption = async () => {
    if (!isAuthenticated || !product) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use points",
        variant: "destructive",
      });
      return;
    }

    const pointsRequired = product.pointsValue || 3;
    if (user && user.points < pointsRequired) {
      toast({
        title: "Insufficient Points",
        description: `You need ${pointsRequired} points but only have ${user.points}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setOrderLoading(true);
      const response = await itemsApi.redeemWithPoints(product._id);

      if (response.success) {
        toast({
          title: "Item Redeemed Successfully! 🎉",
          description: response.message,
        });
        // Refresh page or navigate to orders
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to redeem item";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  // Handle INR purchase
  const handlePurchase = async () => {
    if (!isAuthenticated || !product) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase items",
        variant: "destructive",
      });
      return;
    }

    if (product.seller._id === user?.id) {
      toast({
        title: "Cannot Purchase",
        description: "You cannot buy your own item",
        variant: "destructive",
      });
      return;
    }

    try {
      setOrderLoading(true);
      const response = await itemsApi.purchaseWithINR(product._id, {
        paymentMethod: "razorpay",
      });

      if (response.success) {
        toast({
          title: "Order Created! 💳",
          description: "Redirecting to payment...",
        });
        // In a real app, this would redirect to Razorpay payment
        // For now, just show success
        setTimeout(() => {
          toast({
            title: "Payment Successful! 🎉",
            description:
              "Your order has been confirmed. Check your dashboard for details.",
          });
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to create order";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const nextImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
          <p className="text-text-muted mb-4">
            {error || "This product may have been removed or doesn't exist."}
          </p>
          <Button onClick={() => navigate("/browse")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => navigate("/browse")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse</span>
          </Button>
          <div className="relative flex-1 max-w-md mx-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search similar items..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLike}>
              <Heart
                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="border-border">
              <CardContent className="p-0">
                {/* Main Image */}
                <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
                  <img
                    src={
                      product.images[currentImageIndex]?.url ||
                      "/placeholder.svg"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  {product.images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Badge className="absolute top-4 left-4 bg-primary">
                    {product.condition}
                  </Badge>
                  {product.qualityBadge === "premium" && (
                    <Badge className="absolute top-4 right-4 bg-yellow-500">
                      Premium
                    </Badge>
                  )}
                </div>

                {/* Image Thumbnails */}
                {product.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded border-2 overflow-hidden transition-colors ${
                          index === currentImageIndex
                            ? "border-primary"
                            : "border-border hover:border-muted"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Product Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h1 className="text-2xl font-bold text-foreground mb-1">
                          {product.title}
                        </h1>
                        <p className="text-text-secondary">
                          {product.brand} • Size {product.size}
                        </p>
                      </div>
                      <Badge
                        className={`${
                          product.status === "active"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {product.status === "active"
                          ? "Available"
                          : product.status}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-3xl font-bold text-foreground">
                        ₹{product.price}
                      </div>
                      {product.originalPrice && (
                        <div className="text-lg text-text-muted line-through">
                          ₹{product.originalPrice}
                        </div>
                      )}
                      <div className="text-lg text-text-muted flex items-center">
                        <Recycle className="h-4 w-4 mr-1" />
                        {Math.floor(product.price * 0.1)} pts
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-text-secondary">
                          {product.seller.rating.average} • {product.views}{" "}
                          views
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      )) || (
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Product Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Description
                    </h3>
                    <div className="text-text-secondary whitespace-pre-line text-sm leading-relaxed">
                      {product.description}
                    </div>
                  </div>

                  <Separator />

                  {/* Product Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <Package className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="text-xs text-text-muted">Category</div>
                      <div className="text-sm font-medium text-foreground">
                        {product.category}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="text-xs text-text-muted">Condition</div>
                      <div className="text-sm font-medium text-foreground">
                        {product.condition}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="text-xs text-text-muted">Listed</div>
                      <div className="text-sm font-medium text-foreground">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <Heart className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="text-xs text-text-muted">Likes</div>
                      <div className="text-sm font-medium text-foreground">
                        {product.likes}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Seller Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      Seller Information
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={product.seller.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {product.seller.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {product.seller.name}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-text-secondary">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.seller.rating.average}</span>
                            <span>•</span>
                            <span>{product.seller.rating.count} reviews</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-text-muted">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Member since{" "}
                              {new Date(product.seller.createdAt).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>

                  {/* Exchange Methods */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Get This Item
                    </h3>

                    {product.seller._id === user?.id ? (
                      <div className="text-center p-4 bg-surface rounded-lg">
                        <p className="text-text-muted">This is your own item</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {/* 1. Direct Swap */}
                        {product.swapEnabled && (
                          <Card className="border-blue-200 bg-blue-50/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <ArrowRightLeft className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-blue-900">
                                      Direct Swap
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                      Exchange with your item
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={handleSwapRequest}
                                  disabled={orderLoading}
                                  className="bg-blue-500 hover:bg-blue-600"
                                >
                                  {orderLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                                  )}
                                  Request Swap
                                </Button>
                              </div>
                              <p className="text-xs text-blue-600">
                                Both users gain +3 points after successful swap
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {/* 2. Redeem with Points */}
                        {product.pointsEnabled && (
                          <Card className="border-green-200 bg-green-50/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                    <Coins className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-green-900">
                                      ReWear Points
                                    </h4>
                                    <p className="text-sm text-green-700">
                                      Use your earned points
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={handlePointsRedemption}
                                  disabled={
                                    orderLoading ||
                                    (user?.points || 0) <
                                      (product.pointsValue || 3)
                                  }
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  {orderLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <Coins className="h-4 w-4 mr-2" />
                                  )}
                                  Redeem {product.pointsValue || 3} pts
                                </Button>
                              </div>
                              <p className="text-xs text-green-600">
                                You have {user?.points || 0} points • Seller
                                gets +3 points
                              </p>
                            </CardContent>
                          </Card>
                        )}

                        {/* 3. Buy with INR */}
                        {product.purchaseEnabled && (
                          <Card className="border-purple-200 bg-purple-50/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                    <CreditCard className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-purple-900">
                                      Buy with INR
                                    </h4>
                                    <p className="text-sm text-purple-700">
                                      Secure payment via Razorpay
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={handlePurchase}
                                  disabled={orderLoading}
                                  className="bg-purple-500 hover:bg-purple-600"
                                >
                                  {orderLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <CreditCard className="h-4 w-4 mr-2" />
                                  )}
                                  Buy ₹{product.price}
                                </Button>
                              </div>
                              <p className="text-xs text-purple-600">
                                Secure payment • Instant delivery coordination
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Similar Listings */}
        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Similar Items
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {similarProducts.map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="border border-border rounded-lg p-3 bg-surface cursor-pointer"
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                        <img
                          src={item.images[0]?.url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                      <h4 className="font-medium text-sm mb-2 truncate">
                        {item.title}
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">
                          ₹{item.price}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
