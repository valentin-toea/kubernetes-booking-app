"use client";

import { authApi } from "@/lib/api";
import decodeToken from "@/lib/decodeToken";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  userData: { username: string; id: number } | undefined | null;
  setUserData: React.Dispatch<
    React.SetStateAction<{ username: string; id: number } | undefined | null>
  >;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<
    { username: string; id: number } | undefined | null
  >(null);

  useEffect(() => {
    if (localStorage === undefined) {
      return;
    }

    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      try {
        await authApi.get("auth/validate").then(console.log);
        setIsAuthenticated(!!token);
        setUserData(
          decodeToken(token) as { username: string; id: number } | null
        );
      } catch (err) {
        setIsAuthenticated(false);
        setUserData({ username: "", id: 0 });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loading,
        userData,
        setUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
