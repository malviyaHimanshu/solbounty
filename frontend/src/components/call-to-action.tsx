"use client";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function CallToAction() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex items-center gap-5 mt-5">
      <Link href={ isLoggedIn ? '/dashboard' : '/login' }>
        <Button color="green">{"try now →"}</Button>
      </Link>
      <Button color="white" className="flex items-center gap-2 border-2 border-zinc-200">
        <img className="h-4 object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/480px-Google_Chrome_icon_%28February_2022%29.svg.png" alt="" />
        Download for Chrome
      </Button>
    </div>
  );
}
