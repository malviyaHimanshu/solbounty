"use client";
import Link from "next/link";

export default function Login({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Link href={'/api/auth/github'}>
      {children}
    </Link>
  )
}