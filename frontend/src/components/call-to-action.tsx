"use client";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function CallToAction() {
  const { isLoggedIn } = useAuth();

  return (
    <Link href={ isLoggedIn ? '/dashboard' : '/login' } className="mt-3">
      <Button color="green">{"try now →"}</Button>
    </Link>
  );
}
