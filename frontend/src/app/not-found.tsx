"use client";
import Button from "@/components/button";
import { instrumentSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="grid place-content-center gap-3 h-screen text-center">
      <h1 className={cn("text-5xl text-zinc-500", instrumentSerif.className)}>404: Not Found</h1>
      <p className="text-zinc-600">seems like you are lost :(</p>
      <Button onClick={() => window.history.back()} color="green" className="mt-5">{'<- Go back'}</Button>
    </div>
  )
}