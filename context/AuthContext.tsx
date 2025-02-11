"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user : User | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // Check for token in local storage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const userData: User = await res.json();
      setUser(userData);
    } catch (error) {
      console.error(error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    fetchUser(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};