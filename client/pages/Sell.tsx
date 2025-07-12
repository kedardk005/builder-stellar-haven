import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { itemsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  Camera,
  Plus,
  Package,
  Tag,
  Shirt,
  Search,
  Loader2,
} from "lucide-react";

const Sell = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    size: "",
    condition: "",
    color: "",
    price: "",
    points: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Simulate image URLs for demo
    const newImages = files.map((file) => URL.createObjectURL(file));
    setSelectedImages([...selectedImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Item listing submitted:", formData);
  };

  // Mock previous listings for demo
  const previousListings = [
    { id: 1, title: "Vintage Denim Jacket", status: "Active" },
    { id: 2, title: "Summer Floral Dress", status: "Sold" },
    { id: 3, title: "Leather Handbag", status: "Pending" },
    { id: 4, title: "Casual Sneakers", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            List Your Item
          </h1>
          <p className="text-text-secondary">
            Upload your pre-loved fashion items and earn ReWear points
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              type="text"
              placeholder="Search similar items to get better pricing..."
              className="pl-10 bg-surface border-border"
            />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <Label className="text-foreground font-semibold">
                      Product Images
                    </Label>

                    {/* Main Image Upload */}
                    <div className="relative">
                      <div className="aspect-square border-2 border-dashed border-border rounded-lg bg-surface hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-center">
                        {selectedImages.length > 0 ? (
                          <div className="relative w-full h-full">
                            <img
                              src={selectedImages[0]}
                              alt="Main product"
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeImage(0)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Camera className="h-12 w-12 text-text-muted mx-auto mb-2" />
                            <p className="text-text-muted">Add Main Image</p>
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Images */}
                    <div className="grid grid-cols-4 gap-2">
                      {selectedImages.slice(1, 4).map((image, index) => (
                        <div key={index + 1} className="relative aspect-square">
                          <img
                            src={image}
                            alt={`Product ${index + 2}`}
                            className="w-full h-full object-cover rounded border border-border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-1 -right-1 h-5 w-5 p-0"
                            onClick={() => removeImage(index + 1)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {selectedImages.length < 4 && (
                        <div className="relative aspect-square border border-dashed border-border rounded bg-surface hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-center">
                          <Plus className="h-4 w-4 text-text-muted" />
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details Form */}
                  <div className="space-y-6">
                    <div>
                      <Label className="text-foreground font-semibold mb-4 block">
                        Product Details
                      </Label>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Product Name</Label>
                          <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Vintage Denim Jacket"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="bg-surface border-border"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) =>
                                setFormData({ ...formData, category: value })
                              }
                            >
                              <SelectTrigger className="bg-surface border-border">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tops">Tops</SelectItem>
                                <SelectItem value="bottoms">Bottoms</SelectItem>
                                <SelectItem value="dresses">Dresses</SelectItem>
                                <SelectItem value="shoes">Shoes</SelectItem>
                                <SelectItem value="accessories">
                                  Accessories
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                              id="brand"
                              name="brand"
                              placeholder="Brand name"
                              value={formData.brand}
                              onChange={handleInputChange}
                              className="bg-surface border-border"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="size">Size</Label>
                            <Select
                              value={formData.size}
                              onValueChange={(value) =>
                                setFormData({ ...formData, size: value })
                              }
                            >
                              <SelectTrigger className="bg-surface border-border">
                                <SelectValue placeholder="Size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="xs">XS</SelectItem>
                                <SelectItem value="s">S</SelectItem>
                                <SelectItem value="m">M</SelectItem>
                                <SelectItem value="l">L</SelectItem>
                                <SelectItem value="xl">XL</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select
                              value={formData.condition}
                              onValueChange={(value) =>
                                setFormData({ ...formData, condition: value })
                              }
                            >
                              <SelectTrigger className="bg-surface border-border">
                                <SelectValue placeholder="Condition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="like-new">
                                  Like New
                                </SelectItem>
                                <SelectItem value="excellent">
                                  Excellent
                                </SelectItem>
                                <SelectItem value="good">Good</SelectItem>
                                <SelectItem value="fair">Fair</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe your item in detail..."
                            value={formData.description}
                            onChange={handleInputChange}
                            className="bg-surface border-border min-h-[100px]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              placeholder="250"
                              value={formData.price}
                              onChange={handleInputChange}
                              className="bg-surface border-border"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="points">ReWear Points</Label>
                            <Input
                              id="points"
                              name="points"
                              type="number"
                              placeholder="15"
                              value={formData.points}
                              onChange={handleInputChange}
                              className="bg-surface border-border"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-hover"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            List Item
                          </Button>
                          <Button variant="outline" className="px-6">
                            Available/Swap
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Previous Listings Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">Previous Listings</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  {previousListings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-border rounded-lg p-3 bg-surface cursor-pointer"
                    >
                      <div className="aspect-square bg-muted rounded-md mb-2"></div>
                      <h4 className="font-medium text-sm truncate">
                        {listing.title}
                      </h4>
                      <Badge
                        variant={
                          listing.status === "Active" ? "default" : "secondary"
                        }
                        className="text-xs mt-1"
                      >
                        {listing.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
