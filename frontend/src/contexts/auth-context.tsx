"use client";

import { API_URL } from "@/lib/constants";
import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  checkAuthStatus: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUser] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/auth/status`, {
        withCredentials: true,
      });
      // console.log("response from auth status: ", response.data);
      
      if(response.data.isAuthenticated) {
        setIsLoggedIn(true);
        setUser(response.data.userId);
        // console.log("userId from auth provider: ", response.data.userId);
      }
    } catch(error) {
      setIsLoggedIn(false);
      setUser(null);
    }
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{isLoggedIn, userId, checkAuthStatus}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}