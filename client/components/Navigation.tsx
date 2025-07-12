import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  X,
  ShoppingBag,
  Heart,
  User,
  Search,
  Recycle,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Browse", href: "/browse", icon: ShoppingBag },
    { label: "Sell", href: "/sell", icon: Recycle },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Recycle className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-text-secondary hover:bg-surface hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search for clothes..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Points Badge - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="bg-surface text-text-secondary"
              >
                <Recycle className="h-3 w-3 mr-1" />
                125 pts
              </Badge>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </Button>

            {/* Auth Buttons for New Users */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-secondary hover:text-foreground"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-primary hover:bg-hover">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3 border-t border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search for clothes..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="space-y-3">
              {/* Points */}
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-text-secondary">
                  ReWear Points
                </span>
                <Badge variant="secondary" className="bg-surface">
                  <Recycle className="h-3 w-3 mr-1" />
                  125 pts
                </Badge>
              </div>

              {/* Navigation Items */}
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-2 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-text-secondary hover:bg-surface hover:text-foreground",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Auth Links for Mobile */}
              <Link
                to="/login"
                className="flex items-center space-x-3 px-2 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-3 px-2 py-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-hover transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
