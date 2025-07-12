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

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("reWearUser");
      const savedToken = localStorage.getItem("reWearToken");

      if (savedUser && savedToken) {
        try {
          // Verify token with server
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            const userData: User = {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              points: data.user.points,
              avatar: data.user.avatar,
              role: data.user.role,
            };
            setUser(userData);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem("reWearUser");
            localStorage.removeItem("reWearToken");
          }
        } catch (error) {
          // Network error or invalid response
          localStorage.removeItem("reWearUser");
          localStorage.removeItem("reWearToken");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const userData: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        points: data.user.points,
        avatar: data.user.avatar,
        role: data.user.role,
      };

      setUser(userData);
      localStorage.setItem("reWearUser", JSON.stringify(userData));
      localStorage.setItem("reWearToken", data.token);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.fullName,
          email: userData.email,
          phone: userData.phone || "9999999999", // Default if not provided
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const newUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        points: data.user.points,
        avatar: data.user.avatar,
        role: data.user.role,
      };

      setUser(newUser);
      localStorage.setItem("reWearUser", JSON.stringify(newUser));
      localStorage.setItem("reWearToken", data.token);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("reWearUser");
    localStorage.removeItem("reWearToken");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin" || false,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
