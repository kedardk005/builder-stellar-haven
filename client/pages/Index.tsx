import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { itemsApi } from "@/lib/api";
import { DemoRemovalNotice } from "@/components/DemoRemovalNotice";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Recycle,
  Heart,
  Users,
  Leaf,
  Star,
  TrendingUp,
  ShoppingBag,
  Gift,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Globe,
  Shield,
  Coins,
} from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeUsers: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(false);

  // Fetch featured items and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch some featured items
        const response = await itemsApi.getItems({ limit: 6, featured: true });
        if (response.success) {
          setFeaturedItems(response.data);
          setStats({
            totalItems: response.pagination?.total || 0,
            activeUsers: 250, // Could be fetched from admin API
            totalSales: 1200, // Could be calculated from orders
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-changing hero images
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
      alt: "Sustainable fashion collection",
    },
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      alt: "Vintage clothing store",
    },
    {
      url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop",
      alt: "Fashion exchange community",
    },
    {
      url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop",
      alt: "Pre-loved designer clothes",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Auto-changing Images */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentImageIndex].url}
                alt={heroImages[currentImageIndex].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm mb-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Welcome to the Future of Fashion
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-7xl font-bold text-white leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Turn Your Closet Into
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  Sustainable Rewards
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Join 25,000+ fashion lovers earning rewards by exchanging
                pre-loved clothes. Reduce waste, discover unique pieces, and
                build a sustainable wardrobe that gives back to the planet.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-0 text-lg px-8 py-6 w-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Start Earning Rewards
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/80 bg-white/10 text-white hover:bg-white/20 hover:border-white backdrop-blur-md text-lg px-8 py-6 w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="grid grid-cols-3 gap-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-300">Items Exchanged</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">25K+</div>
                  <div className="text-sm text-gray-300">Happy Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">80%</div>
                  <div className="text-sm text-gray-300">Waste Reduced</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Value Props */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {[
                {
                  icon: Recycle,
                  title: "Earn ReWear Points",
                  description:
                    "Get points for every item you list, swap, or rate. Redeem points for amazing fashion finds.",
                },
                {
                  icon: Globe,
                  title: "Global Fashion Community",
                  description:
                    "Connect with fashion lovers worldwide. Discover unique pieces from different cultures.",
                },
                {
                  icon: Shield,
                  title: "Quality Guaranteed",
                  description:
                    "All items are verified by our community. Shop with confidence knowing every piece is authentic.",
                },
                ...(isAuthenticated
                  ? [
                      {
                        icon: Coins,
                        title: "Multiple Ways to Pay",
                        description:
                          "Use ReWear Points, swap directly, or pay with traditional currency. Your choice!",
                      },
                    ]
                  : [
                      {
                        icon: Heart,
                        title: "Quality Community",
                        description:
                          "Join a trusted community of fashion lovers. Rate items and sellers to maintain quality.",
                      },
                    ]),
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white w-8"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Start Your Sustainable Journey
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Three simple steps to transform your wardrobe and earn rewards
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                step: "1",
                icon: ShoppingBag,
                title: "List Your Items",
                description:
                  "Upload photos of clothes you no longer wear. Add descriptions and earn points for quality listings.",
              },
              {
                step: "2",
                icon: Users,
                title: "Connect & Exchange",
                description:
                  "Browse items from our community. Swap directly, redeem with points, or purchase with INR.",
              },
              {
                step: "3",
                icon: Gift,
                title: "Earn & Repeat",
                description:
                  "Get points for every exchange, referral, and quality rating. Level up your sustainable impact!",
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <Card className="border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-background to-surface">
                    <CardContent className="p-8">
                      <div className="relative mb-6">
                        <div className="h-20 w-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-10 w-10 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-2 -right-2 h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {step.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-r from-surface to-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Join Thousands of Happy Users
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Real people, real stories, real impact on the planet
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { icon: TrendingUp, value: "95%", label: "User Satisfaction" },
              { icon: Users, value: "25K+", label: "Active Community" },
              { icon: Leaf, value: "5M+", label: "CO₂ Saved (kg)" },
              { icon: Star, value: "4.9", label: "App Rating" },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="border-border bg-background/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-text-muted">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Make Fashion Sustainable?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Join our community today and start earning rewards while making a
            positive impact on the planet. Every item exchanged is a step
            towards a more sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 hover:text-primary text-lg px-10 py-6 w-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/browse" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/80 bg-white/10 text-white hover:bg-white/20 hover:border-white backdrop-blur-md text-lg px-10 py-6 w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Explore Items
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-75">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Verified Items</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Community Approved</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
