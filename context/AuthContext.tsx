"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
type User = {
  _id: string;
  googleId: string | null;
  avatar: string | null;
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // Add loading state
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();
  // Check for token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/user`, {
          method: "GET",
          credentials: "include", 
        });

        if (!res.ok) throw new Error("Token verification failed");

        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error(error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); 
      }
    };

    verifyToken();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/;`;
    fetchUser(token);
    setIsAuthenticated(true);
  };

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/user`, {
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

  const logout = async () => {
    try {
      // Clear the token from localStorage (email/password users)
      localStorage.removeItem("token");
  
      // Clear the token cookie (Google-authenticated users)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookies in the request
      });
  
      // Update the authentication state
      setIsAuthenticated(false);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
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