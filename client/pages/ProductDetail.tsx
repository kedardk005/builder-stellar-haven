import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Mock product data
  const product = {
    id: 1,
    title: "Vintage Denim Jacket",
    brand: "Levi's",
    size: "M",
    condition: "Excellent",
    price: 450,
    points: 25,
    description: `This classic Levi's denim jacket is a timeless piece that never goes out of style. 
    Made from high-quality denim with minimal wear, it features the iconic trucker jacket design 
    with button closure and chest pockets. Perfect for layering over any outfit.
    
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
    • Sleeve: 25 inches`,
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    seller: {
      name: "FashionLover23",
      rating: 4.8,
      totalSales: 45,
      location: "Mumbai, Maharashtra",
      joinDate: "2023",
      avatar: "/placeholder-avatar.jpg",
    },
    tags: ["Vintage", "Denim", "Casual", "Sustainable"],
    uploadDate: "2024-01-15",
    views: 234,
    likes: 18,
    category: "Outerwear",
    color: "Blue",
    availability: "Available",
  };

  // Mock similar/previous listings
  const similarListings = [
    {
      id: 2,
      title: "Cotton Denim Shirt",
      price: 320,
      image: "/placeholder.svg",
      condition: "Good",
    },
    {
      id: 3,
      title: "Vintage Leather Jacket",
      price: 890,
      image: "/placeholder.svg",
      condition: "Like New",
    },
    {
      id: 4,
      title: "Casual Blue Jeans",
      price: 280,
      image: "/placeholder.svg",
      condition: "Excellent",
    },
    {
      id: 5,
      title: "Denim Overalls",
      price: 550,
      image: "/placeholder.svg",
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button variant="ghost" className="flex items-center space-x-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
              />
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
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center text-text-muted"><span>Product Image</span></div>';
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
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement!.innerHTML =
                              '<div class="w-full h-full bg-muted flex items-center justify-center text-xs text-text-muted">Img</div>';
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
                          product.availability === "Available"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {product.availability}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-3xl font-bold text-foreground">
                        ₹{product.price}
                      </div>
                      <div className="text-lg text-text-muted flex items-center">
                        <Recycle className="h-4 w-4 mr-1" />
                        {product.points} pts
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-text-secondary">
                          {product.seller.rating} • {product.views} views
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
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
                        {new Date(product.uploadDate).toLocaleDateString()}
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
                            <span>{product.seller.rating}</span>
                            <span>•</span>
                            <span>{product.seller.totalSales} sales</span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-text-muted">
                            <MapPin className="h-3 w-3" />
                            <span>{product.seller.location}</span>
                            <span>
                              • Member since {product.seller.joinDate}
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

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-primary hover:bg-hover">
                      <Package className="h-4 w-4 mr-2" />
                      Buy Now - ₹{product.price}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Recycle className="h-4 w-4 mr-2" />
                      Redeem with {product.points} Points
                    </Button>
                    <Button variant="outline">Available/Swap</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Similar Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Similar Listings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarListings.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-border rounded-lg p-3 bg-surface cursor-pointer"
                  >
                    <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden">
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
      </div>
    </div>
  );
};

export default ProductDetail;
