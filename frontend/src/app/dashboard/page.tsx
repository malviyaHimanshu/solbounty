"use client";
import { redirect } from "next/navigation";

export default function Dashboard() {
  redirect('/dashboard/home');
  return null;
}