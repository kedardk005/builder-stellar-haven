import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
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
  Truck,
  Clock,
  CreditCard,
  Users,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    specialInstructions: "",
  });

  // Mock product data with multiple images
  const product = {
    id: 1,
    title: "Vintage Denim Jacket",
    brand: "Levi's",
    size: "M",
    condition: "Excellent",
    price: 450,
    points: 25,
    originalPrice: 899,
    description: `This classic Levi's denim jacket is a timeless piece that never goes out of style. 
    Made from high-quality denim with minimal wear, it features the iconic trucker jacket design 
    with button closure and chest pockets. Perfect for layering over any outfit.
    
    This item has been pre-loved and shows minimal signs of wear. It has been thoroughly cleaned 
    and inspected to ensure quality. The jacket maintains its original shape and color.
    
    Key Features:
    • 100% Cotton Denim
    • Classic Trucker Design
    • Two Chest Pockets
    • Button Closure
    • Minimal Signs of Wear
    • Well Maintained
    
    Measurements:
    • Chest: 22 inches
    • Length: 26 inches
    • Shoulder: 18 inches
    • Sleeve: 25 inches
    
    Care Instructions:
    • Machine wash cold
    • Tumble dry low
    • Iron on medium heat`,
    images: [
      "https://images.unsplash.com/photo-1544966503-7ba9043d5ada?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop",
    ],
    seller: {
      name: "FashionLover23",
      rating: 4.8,
      totalSales: 45,
      location: "Mumbai, Maharashtra",
      joinDate: "2023",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      responseTime: "Usually responds within 2 hours",
      verificationStatus: "Verified Seller",
    },
    tags: ["Vintage", "Denim", "Casual", "Sustainable", "Levi's"],
    uploadDate: "2024-01-15",
    views: 234,
    likes: 18,
    category: "Outerwear",
    color: "Blue",
    availability: "Available",
    availableSizes: ["S", "M", "L"],
    shipping: {
      estimatedDays: "3-5 business days",
      cost: 99,
      freeShippingThreshold: 500,
    },
    returnPolicy: "30-day return policy",
    authenticity: "Verified authentic by ReWear",
  };

  // Mock similar/previous listings
  const similarListings = [
    {
      id: 2,
      title: "Cotton Denim Shirt",
      price: 320,
      image:
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
      condition: "Good",
    },
    {
      id: 3,
      title: "Vintage Leather Jacket",
      price: 890,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      condition: "Like New",
    },
    {
      id: 4,
      title: "Casual Blue Jeans",
      price: 280,
      image:
        "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400&h=400&fit=crop",
      condition: "Excellent",
    },
    {
      id: 5,
      title: "Denim Overalls",
      price: 550,
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
      condition: "Good",
    },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1,
    );
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) return;
    setShowBuyDialog(true);
  };

  const handleDeliveryDetailsChange = (field: string, value: string) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isShippingFree =
    product.price >= product.shipping.freeShippingThreshold;
  const totalCost =
    product.price + (isShippingFree ? 0 : product.shipping.cost);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link to="/browse">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Browse</span>
            </Button>
          </Link>
          <div className="relative flex-1 max-w-md mx-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              type="text"
              placeholder="Search similar items..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <AuthGuard feature="wishlist">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
              </Button>
            </AuthGuard>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <Card className="border-border overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
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
                <Badge className="absolute top-4 right-4 bg-green-500">
                  <Shield className="h-3 w-3 mr-1" />
                  {product.authenticity}
                </Badge>
              </div>
            </Card>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg border-2 overflow-hidden transition-colors ${
                    index === currentImageIndex
                      ? "border-primary"
                      : "border-border hover:border-muted"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info & Purchase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {product.title}
                  </h1>
                  <p className="text-lg text-text-secondary">
                    {product.brand} • {product.category}
                  </p>
                </div>
                <Badge
                  className={`${
                    product.availability === "Available"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {product.availability}
                </Badge>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl font-bold text-foreground">
                  ₹{product.price}
                </div>
                <div className="text-lg text-text-muted line-through">
                  ₹{product.originalPrice}
                </div>
                <Badge variant="secondary" className="text-sm">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100,
                  )}
                  % OFF
                </Badge>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="text-lg text-text-muted flex items-center">
                  <Recycle className="h-4 w-4 mr-1" />
                  {product.points} ReWear Points
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-text-secondary">
                    {product.seller.rating} • {product.views} views
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Available Sizes
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {product.availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="h-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <Card className="border-border bg-surface">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Delivery Information</div>
                    <div className="text-sm text-text-secondary">
                      {product.shipping.estimatedDays}
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  {isShippingFree ? (
                    <span className="text-green-600 font-medium">
                      Free Shipping
                    </span>
                  ) : (
                    <span>Shipping: ₹{product.shipping.cost}</span>
                  )}
                  {!isShippingFree && (
                    <span className="text-text-muted ml-2">
                      (Free on orders above ₹
                      {product.shipping.freeShippingThreshold})
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <AuthGuard feature="purchasing items">
                <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-primary hover:bg-hover text-lg py-6"
                      onClick={handleBuyNow}
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Buy Now - ₹{totalCost}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Complete Your Purchase</DialogTitle>
                      <DialogDescription>
                        Enter your delivery details to complete the purchase
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Item Total:</span>
                          <span>₹{product.price}</span>
                        </div>
                        {!isShippingFree && (
                          <div className="flex justify-between items-center mb-2">
                            <span>Shipping:</span>
                            <span>₹{product.shipping.cost}</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center font-bold">
                          <span>Total:</span>
                          <span>₹{totalCost}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="address">Delivery Address</Label>
                          <Textarea
                            id="address"
                            placeholder="Enter your complete address"
                            value={deliveryDetails.address}
                            onChange={(e) =>
                              handleDeliveryDetailsChange(
                                "address",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="City"
                              value={deliveryDetails.city}
                              onChange={(e) =>
                                handleDeliveryDetailsChange(
                                  "city",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              placeholder="Postal Code"
                              value={deliveryDetails.postalCode}
                              onChange={(e) =>
                                handleDeliveryDetailsChange(
                                  "postalCode",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Phone number for delivery updates"
                            value={deliveryDetails.phone}
                            onChange={(e) =>
                              handleDeliveryDetailsChange(
                                "phone",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="instructions">
                            Special Instructions (Optional)
                          </Label>
                          <Textarea
                            id="instructions"
                            placeholder="Any special delivery instructions"
                            value={deliveryDetails.specialInstructions}
                            onChange={(e) =>
                              handleDeliveryDetailsChange(
                                "specialInstructions",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      </div>

                      <Button className="w-full">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Payment
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </AuthGuard>

              <div className="grid grid-cols-2 gap-3">
                <AuthGuard feature="redeeming with points">
                  <Button variant="outline" className="py-6">
                    <Recycle className="h-4 w-4 mr-2" />
                    Redeem ({product.points} pts)
                  </Button>
                </AuthGuard>
                <AuthGuard feature="item swapping">
                  <Button variant="outline" className="py-6">
                    Swap Request
                  </Button>
                </AuthGuard>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-surface rounded-lg">
                <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xs text-text-muted">Condition</div>
                <div className="text-sm font-medium text-foreground">
                  {product.condition}
                </div>
              </div>
              <div className="text-center p-3 bg-surface rounded-lg">
                <Package className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-xs text-text-muted">Return Policy</div>
                <div className="text-sm font-medium text-foreground">
                  30 Days
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="seller">Seller Info</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-line text-text-secondary">
                      {product.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={product.seller.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {product.seller.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {product.seller.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {product.seller.verificationStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {product.seller.rating}/5
                            </span>
                          </div>
                          <div className="text-text-muted">
                            {product.seller.totalSales} successful sales
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <MapPin className="h-3 w-3 text-text-muted" />
                            <span className="font-medium">
                              {product.seller.location}
                            </span>
                          </div>
                          <div className="text-text-muted">
                            Member since {product.seller.joinDate}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-text-secondary">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {product.seller.responseTime}
                      </div>
                    </div>
                    <AuthGuard feature="messaging sellers">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </AuthGuard>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Truck className="h-4 w-4 mr-2" />
                      Shipping Information
                    </h4>
                    <div className="text-sm text-text-secondary space-y-1">
                      <div>
                        • Estimated delivery: {product.shipping.estimatedDays}
                      </div>
                      <div>
                        • Shipping cost:{" "}
                        {isShippingFree ? "Free" : `₹${product.shipping.cost}`}
                      </div>
                      <div>
                        • Free shipping on orders above ₹
                        {product.shipping.freeShippingThreshold}
                      </div>
                      <div>• Tracking number provided after shipment</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Return Policy
                    </h4>
                    <div className="text-sm text-text-secondary space-y-1">
                      <div>• {product.returnPolicy}</div>
                      <div>• Item must be in original condition</div>
                      <div>• Return shipping paid by buyer</div>
                      <div>• Refund processed within 5-7 business days</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Quality Assurance
                    </h4>
                    <div className="text-sm text-text-secondary space-y-1">
                      <div>• All items professionally inspected</div>
                      <div>• Authenticity guaranteed</div>
                      <div>• Condition accurately described</div>
                      <div>• Satisfaction guarantee</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Similar Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-xl">You Might Also Like</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarListings.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                  >
                    <Link to={`/product/${item.id}`}>
                      <Card className="border-border hover:shadow-lg transition-shadow">
                        <CardContent className="p-3">
                          <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
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
                        </CardContent>
                      </Card>
                    </Link>
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

export default ProductDetail;
