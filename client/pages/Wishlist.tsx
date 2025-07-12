import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import {
  Heart,
  Star,
  Recycle,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([
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
      addedDate: "2024-01-15",
      available: true,
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
      addedDate: "2024-01-12",
      available: true,
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
      addedDate: "2024-01-10",
      available: false, // Item sold
    },
  ]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems((items) => items.filter((item) => item.id !== itemId));
  };

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
                My Wishlist
              </h1>
              <p className="text-text-secondary">
                Items you've saved for later ({wishlistItems.length} items)
              </p>
            </div>
            <Link to="/browse">
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Browse More Items
              </Button>
            </Link>
          </div>
        </motion.div>

        {wishlistItems.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center">
              <Heart className="h-16 w-16 text-text-muted" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Start browsing and save items you love to build your perfect
              sustainable wardrobe.
            </p>
            <Link to="/browse">
              <Button className="bg-primary hover:bg-hover">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          // Wishlist Items
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Card
                  className={cn(
                    "border-border hover:shadow-lg transition-all duration-300 group",
                    !item.available && "opacity-60",
                  )}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {!item.available && (
                        <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm">
                            No Longer Available
                          </Badge>
                        </div>
                      )}

                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="bg-background/80 hover:bg-background"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500 text-white">
                          <Heart className="h-3 w-3 mr-1 fill-current" />
                          Saved
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">
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

                      <div className="text-xs text-text-muted">
                        Added {new Date(item.addedDate).toLocaleDateString()}
                      </div>

                      <div className="pt-2">
                        {item.available ? (
                          <Link to={`/product/${item.id}`}>
                            <Button className="w-full" size="sm">
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            disabled
                          >
                            No Longer Available
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Recommendations */}
        {wishlistItems.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-border bg-surface">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  You might also like
                </h3>
                <p className="text-text-secondary mb-4">
                  Based on your wishlist preferences, we recommend checking out
                  similar sustainable fashion items.
                </p>
                <Link to="/browse">
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Discover More Items
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
