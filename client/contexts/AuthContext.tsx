import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  avatar?: string;
  role?: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate checking for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("reWearUser");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("reWearUser");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true);
    try {
      // Mock successful login
      const mockUser: User = {
        id: "1",
        name: email.includes("admin") ? "Admin User" : "John Doe",
        email: email,
        points: 125,
        avatar: "/placeholder-avatar.jpg",
        role: email.includes("admin") ? "admin" : "user",
      };

      setUser(mockUser);
      localStorage.setItem("reWearUser", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    // Simulate API call
    setLoading(true);
    try {
      const mockUser: User = {
        id: Date.now().toString(),
        name: userData.fullName,
        email: userData.email,
        points: 50, // Welcome bonus
        avatar: "/placeholder-avatar.jpg",
        role: "user",
      };

      setUser(mockUser);
      localStorage.setItem("reWearUser", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("reWearUser");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin" || user?.email?.includes("admin") || false,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
