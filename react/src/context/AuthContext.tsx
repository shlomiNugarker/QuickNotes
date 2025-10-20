import { authService } from "@/services/auth.service";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error("Authentication error:", error);
        setToken(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const user = await authService.login(email, password);
      const newToken = localStorage.getItem("token");

      setToken(newToken);
      setUser(user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    const user = await authService.register(email, password);
    const newToken = localStorage.getItem("token");

    setToken(newToken);
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, register }}
    >
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
