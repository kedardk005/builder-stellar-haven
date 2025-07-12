import { useState } from "react";
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
import {
  Filter,
  Search,
  Heart,
  Star,
  Recycle,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Browse = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Browse Items
          </h1>
          <p className="text-text-secondary">
            Discover amazing pre-loved fashion from our community
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
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
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div
            className={cn(
              "w-64 space-y-6",
              showFilters ? "block" : "hidden lg:block",
            )}
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
          </div>

          {/* Items Grid/List */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-text-secondary">
                Showing {items.length} of {items.length} items
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="border-border hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-square bg-muted rounded-t-lg">
                          {/* Placeholder for item image */}
                        </div>
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
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="border-border hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0"></div>
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
                ))}
              </div>
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
