"use client";
import Link from "next/link";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth-context";
import { LoginIcon } from "@/icons";

export default function LoginButton() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <div className="flex items-center gap-5">
          <Link href={"/dashboard"}>
            <Button color="white" className="border-2 border-zinc-200">Dashboard</Button>
          </Link>
        </div>
      ) : (
        <Link href={"/login"}>
          <Button color="black" className="flex items-center gap-2 pr-5">
            <LoginIcon size={17} color="white" />
            Login
          </Button>
        </Link>
      )}
    </div>
  );
}
