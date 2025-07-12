import { Link } from "react-router-dom";
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
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-surface to-secondary/20 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  <Leaf className="h-3 w-3 mr-1" />
                  Sustainable Fashion Platform
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Fashion that <span className="text-primary">Cares</span> for
                  Tomorrow
                </h1>
                <p className="text-lg text-text-secondary max-w-lg">
                  Join thousands of fashion lovers exchanging, redeeming, and
                  discovering pre-loved clothing. Reduce waste, earn points, and
                  build a sustainable wardrobe.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-hover">
                  Start Exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border hover:bg-surface"
                >
                  How It Works
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
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
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className="relative">
              <div className="bg-surface rounded-2xl p-8 shadow-lg border border-border">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                      <Recycle className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-semibold">ReWear</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="h-24 bg-muted rounded-md mb-2"></div>
                      <div className="text-xs font-medium">Vintage Denim</div>
                      <div className="text-xs text-text-muted">
                        ₹250 • 15 pts
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="h-24 bg-muted rounded-md mb-2"></div>
                      <div className="text-xs font-medium">Summer Dress</div>
                      <div className="text-xs text-text-muted">
                        ₹180 • 12 pts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                <Heart className="h-4 w-4" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-background border border-border rounded-full p-3 shadow-lg">
                <Star className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How ReWear Works
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Simple steps to start your sustainable fashion journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload & List</h3>
                <p className="text-text-secondary">
                  Upload photos of your pre-loved clothes with detailed
                  descriptions and earn points for approved listings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Exchange & Redeem
                </h3>
                <p className="text-text-secondary">
                  Swap items with others, redeem with ReWear Points, or purchase
                  using INR through secure payments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
                <p className="text-text-secondary">
                  Get points for quality uploads, successful swaps, and
                  referrals. Build your sustainable wardrobe affordably.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose ReWear?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Sustainable Impact</h4>
                    <p className="text-text-secondary text-sm">
                      Reduce textile waste and promote circular fashion
                      practices.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Community Driven</h4>
                    <p className="text-text-secondary text-sm">
                      Connect with like-minded fashion enthusiasts in your area.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Reward System</h4>
                    <p className="text-text-secondary text-sm">
                      Earn points for every contribution to the platform.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Quality Assurance</h4>
                    <p className="text-text-secondary text-sm">
                      Admin-approved listings ensure high-quality exchanges.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">95%</div>
                  <div className="text-sm text-text-muted">
                    User Satisfaction
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">10K+</div>
                  <div className="text-sm text-text-muted">Monthly Swaps</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <Leaf className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">5M+</div>
                  <div className="text-sm text-text-muted">CO₂ Saved (kg)</div>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold text-foreground">4.8</div>
                  <div className="text-sm text-text-muted">App Rating</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
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
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
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
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-text-muted">
            <p>© 2024 ReWear. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
