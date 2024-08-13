"use client";
import Button from "./button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginWithGitHub() {
  const { data: session, status } = useSession();

  const handleClick = () => {
    signIn("github", {
      callbackUrl: `${window.location.origin}/dashboard`,
    });
  }

  return (
    <>
    {status === 'unauthenticated' && (
      <Button onClick={handleClick} color="black" className="flex items-center gap-2">
        <GitHubLogoIcon />
        Login
      </Button>
    )}
    { status === 'authenticated' && (
      <Link href={'/dashboard'}>
        <Button color="black">Dashboard</Button>
      </Link>
    )}
    </>
  );
}
