"use client";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function ProtectedRoute({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if(!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if(!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return <>{children}</>
}