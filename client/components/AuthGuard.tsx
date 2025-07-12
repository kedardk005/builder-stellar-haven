import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Heart, ShoppingBag, User, ArrowRight } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  feature: string;
  fallbackAction?: () => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  feature,
  fallbackAction,
}) => {
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleProtectedAction = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      setShowAuthDialog(true);
      return;
    }
    fallbackAction?.();
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <div onClick={handleProtectedAction} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-center">
              You need to sign in to access {feature}. Join our sustainable
              fashion community and start earning rewards!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Features Preview */}
            <div className="grid gap-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3 p-3 bg-surface rounded-lg"
              >
                <Heart className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Save to Wishlist</div>
                  <div className="text-text-muted">
                    Keep track of items you love
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3 p-3 bg-surface rounded-lg"
              >
                <ShoppingBag className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">List Your Items</div>
                  <div className="text-text-muted">
                    Earn points for quality listings
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-3 p-3 bg-surface rounded-lg"
              >
                <User className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Personalized Dashboard</div>
                  <div className="text-text-muted">
                    Track your sustainable impact
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/register" onClick={() => setShowAuthDialog(false)}>
                <Button className="w-full bg-primary hover:bg-hover">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/login" onClick={() => setShowAuthDialog(false)}>
                <Button variant="outline" className="w-full">
                  Sign In Instead
                </Button>
              </Link>
            </div>

            <div className="text-center text-xs text-text-muted pt-2">
              Join 25,000+ users making fashion sustainable
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Wrapper component for protected buttons
export const ProtectedButton: React.FC<{
  children: React.ReactNode;
  feature: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
}> = ({ children, feature, onClick, className, variant, size }) => {
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    onClick?.();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={className}
        variant={variant}
        size={size}
      >
        {children}
      </Button>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-center">
              You need to sign in to access {feature}. Join our sustainable
              fashion community!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-6">
            <Link to="/register" onClick={() => setShowAuthDialog(false)}>
              <Button className="w-full bg-primary hover:bg-hover">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link to="/login" onClick={() => setShowAuthDialog(false)}>
              <Button variant="outline" className="w-full">
                Sign In Instead
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
