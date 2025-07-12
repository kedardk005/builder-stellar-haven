import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthGuard, ProtectedButton } from "@/components/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  Filter,
  Search,
  Heart,
  Star,
  Recycle,
  Grid3X3,
  List,
  SlidersHorizontal,
  ShoppingBag,
  Users,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Browse = () => {
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Auto-changing banner images
  const bannerImages = [
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      alt: "Sustainable Fashion Marketplace",
    },
    {
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=400&fit=crop",
      alt: "Vintage Clothing Collection",
    },
    {
      url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=400&fit=crop",
      alt: "Fashion Exchange Community",
    },
    {
      url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&h=400&fit=crop",
      alt: "Pre-loved Designer Items",
    },
  ];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Mock data for demonstration
  const items = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      brand: "Levi's",
      size: "M",
      condition: "Excellent",
      price: 450,
      points: 25,
      image:
        "https://images.unsplash.com/photo-1544966503-7ba9043d5ada?w=400&h=400&fit=crop",
      tags: ["Vintage", "Denim", "Casual"],
      rating: 4.8,
      seller: "FashionLover23",
      isLiked: false,
      quality: "high",
    },
    {
      id: 2,
      title: "Summer Floral Dress",
      brand: "Zara",
      size: "S",
      condition: "Good",
      price: 280,
      points: 18,
      image:
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
      tags: ["Summer", "Floral", "Dress"],
      rating: 4.5,
      seller: "StyleGuru",
      isLiked: true,
      quality: "medium",
    },
    {
      id: 3,
      title: "Designer Leather Bag",
      brand: "Coach",
      size: "One Size",
      condition: "Like New",
      price: 1200,
      points: 65,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      tags: ["Designer", "Leather", "Accessories"],
      rating: 5.0,
      seller: "LuxuryCloset",
      isLiked: false,
      quality: "premium",
    },
    {
      id: 4,
      title: "Casual White Sneakers",
      brand: "Adidas",
      size: "9",
      condition: "Good",
      price: 320,
      points: 20,
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      tags: ["Sneakers", "Casual", "Sports"],
      rating: 4.2,
      seller: "SneakerHead",
      isLiked: false,
      quality: "medium",
    },
    {
      id: 5,
      title: "Wool Winter Coat",
      brand: "H&M",
      size: "L",
      condition: "Excellent",
      price: 380,
      points: 22,
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop",
      tags: ["Winter", "Wool", "Coat"],
      rating: 4.6,
      seller: "WinterWardrobe",
      isLiked: true,
      quality: "high",
    },
    {
      id: 6,
      title: "Silk Formal Shirt",
      brand: "Ralph Lauren",
      size: "M",
      condition: "Like New",
      price: 650,
      points: 35,
      image:
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=400&fit=crop",
      tags: ["Formal", "Silk", "Business"],
      rating: 4.9,
      seller: "ProfessionalStyle",
      isLiked: false,
      quality: "premium",
    },
  ];

  const categories = [
    "All Categories",
    "Tops",
    "Bottoms",
    "Dresses",
    "Shoes",
    "Accessories",
    "Outerwear",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const conditions = ["Like New", "Excellent", "Good", "Fair"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner with Auto-changing Images */}
      <motion.section
        className="relative h-80 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBannerIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img
                src={bannerImages[currentBannerIndex].url}
                alt={bannerImages[currentBannerIndex].alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm mb-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Sustainable Fashion Marketplace
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Discover Pre-Loved Fashion Treasures
              </h1>
              <p className="text-lg text-gray-100 mb-6 drop-shadow-md">
                Browse thousands of verified items from our community. Find
                unique pieces, earn rewards, and make sustainable choices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                  <Input
                    type="text"
                    placeholder="Search for items, brands, or styles..."
                    className="pl-10 bg-white/90 backdrop-blur-sm border-white/20"
                  />
                </div>
                <ProtectedButton
                  feature="selling items"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Selling
                </ProtectedButton>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        {/* Browse Controls */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                type="text"
                placeholder="Search for items, brands, or sellers..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="points-low">Points: Low to High</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-border bg-surface">
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {items.length}
              </div>
              <div className="text-xs text-text-muted">Items Available</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-surface">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">250+</div>
              <div className="text-xs text-text-muted">Active Sellers</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-surface">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">4.8</div>
              <div className="text-xs text-text-muted">Avg Rating</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-surface">
            <CardContent className="p-4 text-center">
              <Recycle className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-xs text-text-muted">Items Recycled</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.div
            className={cn(
              "w-64 space-y-6",
              showFilters ? "block" : "hidden lg:block",
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={category} />
                      <Label
                        htmlFor={category}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Condition</h3>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div
                      key={condition}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox id={condition} />
                      <Label
                        htmlFor={condition}
                        className="text-sm cursor-pointer"
                      >
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="under-500" />
                      <Label htmlFor="under-500" className="text-sm">
                        Under ₹500
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="500-1000" />
                      <Label htmlFor="500-1000" className="text-sm">
                        ₹500 - ₹1000
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="over-1000" />
                      <Label htmlFor="over-1000" className="text-sm">
                        Over ₹1000
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Items Grid/List */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-text-secondary">
                Showing {items.length} of {items.length} items
              </p>
            </div>

            {viewMode === "grid" ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer group">
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <AuthGuard feature="wishlist">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                            >
                              <Heart
                                className={cn(
                                  "h-4 w-4",
                                  item.isLiked
                                    ? "fill-red-500 text-red-500"
                                    : "text-text-muted",
                                )}
                              />
                            </Button>
                          </AuthGuard>
                          {item.quality === "premium" && (
                            <Badge className="absolute top-2 left-2 bg-primary">
                              Premium
                            </Badge>
                          )}
                          {item.quality === "high" && (
                            <Badge className="absolute top-2 left-2 bg-yellow-500">
                              High Quality
                            </Badge>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-text-secondary">
                              {item.brand} • Size {item.size}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-text-secondary">
                              {item.rating} • by {item.seller}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-foreground">
                                ₹{item.price}
                              </div>
                              <div className="text-xs text-text-muted flex items-center">
                                <Recycle className="h-3 w-3 mr-1" />
                                {item.points} pts
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs text-primary border-primary"
                            >
                              {item.condition}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-text-secondary">
                                  {item.brand} • Size {item.size}
                                </p>
                              </div>
                              <AuthGuard feature="wishlist">
                                <Button variant="ghost" size="sm">
                                  <Heart
                                    className={cn(
                                      "h-4 w-4",
                                      item.isLiked
                                        ? "fill-red-500 text-red-500"
                                        : "text-text-muted",
                                    )}
                                  />
                                </Button>
                              </AuthGuard>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-text-secondary">
                                {item.rating} • by {item.seller}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <div className="font-semibold text-foreground">
                                    ₹{item.price}
                                  </div>
                                  <div className="text-xs text-text-muted flex items-center">
                                    <Recycle className="h-3 w-3 mr-1" />
                                    {item.points} pts
                                  </div>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs text-primary border-primary"
                                >
                                  {item.condition}
                                </Badge>
                              </div>
                              <Button size="sm">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Load More Items
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
