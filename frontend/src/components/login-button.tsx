"use client";
import Link from "next/link";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth-context";

export default function LoginButton() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <div className="flex items-center gap-5">
          <Link href={"/dashboard"}>
            <Button color="black">Dashboard</Button>
          </Link>
        </div>
      ) : (
        <Link href={"/login"}>
          <Button color="black">Login</Button>
        </Link>
      )}
    </div>
  );
}
