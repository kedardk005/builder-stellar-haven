import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";

const Index = () => {
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-secondary/20 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    <Leaf className="h-3 w-3 mr-1" />
                    Sustainable Fashion Platform
                  </Badge>
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Fashion that <span className="text-primary">Cares</span> for
                  Tomorrow
                </motion.h1>
                <motion.p
                  className="text-lg text-text-secondary max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Join thousands of fashion lovers exchanging, redeeming, and
                  discovering pre-loved clothing. Reduce waste, earn points, and
                  build a sustainable wardrobe.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Link to="/browse">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-hover w-full sm:w-auto"
                  >
                    Start Exploring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-surface"
                >
                  How It Works
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-text-muted">Items Exchanged</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">25K+</div>
                  <div className="text-sm text-text-muted">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">80%</div>
                  <div className="text-sm text-text-muted">Waste Reduction</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image/Mockup */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="bg-surface rounded-2xl p-8 shadow-lg border border-border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                      <Recycle className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold">ReWear</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      className="bg-background rounded-lg p-3 border border-border"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-24 bg-muted rounded-md mb-2"></div>
                      <div className="text-xs font-medium">Vintage Denim</div>
                      <div className="text-xs text-text-muted">
                        ₹250 • 15 pts
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-background rounded-lg p-3 border border-border"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="h-24 bg-muted rounded-md mb-2"></div>
                      <div className="text-xs font-medium">Summer Dress</div>
                      <div className="text-xs text-text-muted">
                        ₹180 • 12 pts
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-4 w-4" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-background border border-border rounded-full p-3 shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Star className="h-4 w-4 text-yellow-500" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How ReWear Works
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Simple steps to start your sustainable fashion journey
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
                icon: ShoppingBag,
                title: "Upload & List",
                description:
                  "Upload photos of your pre-loved clothes with detailed descriptions and earn points for approved listings.",
              },
              {
                icon: Recycle,
                title: "Exchange & Redeem",
                description:
                  "Swap items with others, redeem with ReWear Points, or purchase using INR through secure payments.",
              },
              {
                icon: Gift,
                title: "Earn Rewards",
                description:
                  "Get points for quality uploads, successful swaps, and referrals. Build your sustainable wardrobe affordably.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border-border hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6 text-center">
                      <motion.div
                        className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose ReWear?
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Sustainable Impact",
                    description:
                      "Reduce textile waste and promote circular fashion practices.",
                  },
                  {
                    title: "Community Driven",
                    description:
                      "Connect with like-minded fashion enthusiasts in your area.",
                  },
                  {
                    title: "Reward System",
                    description:
                      "Earn points for every contribution to the platform.",
                  },
                  {
                    title: "Quality Assurance",
                    description:
                      "Admin-approved listings ensure high-quality exchanges.",
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-text-secondary text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { icon: TrendingUp, value: "95%", label: "User Satisfaction" },
                { icon: Users, value: "10K+", label: "Monthly Swaps" },
                { icon: Leaf, value: "5M+", label: "CO₂ Saved (kg)" },
                { icon: Star, value: "4.8", label: "App Rating" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="border-border">
                      <CardContent className="p-6 text-center">
                        <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                        <div className="text-2xl font-bold text-foreground">
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
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-primary text-primary-foreground"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users creating a more sustainable fashion future.
            Start exchanging, earning points, and discovering amazing pre-loved
            clothes today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Sign Up Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Recycle className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ReWear</span>
              </div>
              <p className="text-text-secondary text-sm">
                Building a sustainable fashion future, one exchange at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <div className="space-y-2 text-sm text-text-secondary">
                <Link to="/browse" className="block hover:text-foreground">
                  Browse Items
                </Link>
                <Link to="/sell" className="block hover:text-foreground">
                  List Items
                </Link>
                <Link
                  to="/how-it-works"
                  className="block hover:text-foreground"
                >
                  How It Works
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm text-text-secondary">
                <Link to="/help" className="block hover:text-foreground">
                  Help Center
                </Link>
                <Link to="/contact" className="block hover:text-foreground">
                  Contact Us
                </Link>
                <Link to="/safety" className="block hover:text-foreground">
                  Safety Tips
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-sm text-text-secondary">
                <Link to="/about" className="block hover:text-foreground">
                  About Us
                </Link>
                <Link to="/careers" className="block hover:text-foreground">
                  Careers
                </Link>
                <Link to="/press" className="block hover:text-foreground">
                  Press
                </Link>
              </div>
            </div>
          </motion.div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-muted">
            <p>© 2024 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
