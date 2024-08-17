"use client";
import { cn } from "@/lib/utils"
import React, { useState } from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "green" | "blue" | "black" | "white" | "red" | "purple",
  type?: "default" | "flat",
  className?: string,
  children: React.ReactNode
}

export default function Button({
  color,
  className,
  children,
  ...props
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button 
      className={cn(
        `bg-gradient-to-b from-${color}-400 to-${color}-600 px-4 py-1 rounded-lg text-base font-medium transition-all duration-200 ease-in-out border-2 disabled:opacity-70 disabled:cursor-not-allowed`,
        isPressed ? "scale-95" : "scale-100",
        color === "green" && "from-green-400 to-green-600 text-white border-green-300",
        color === "blue" && "from-blue-400 to-blue-600 text-white border-blue-300",
        color === "red" && "from-red-400 to-red-600 text-white border-red-300",
        color === "black" && "from-zinc-600 to-zinc-800 text-white border-zinc-500",
        color === "white" && "from-zinc-100 to-zinc-300 text-black border-zinc-50",
        color === "purple" && "from-purple-400 to-purple-600 text-white border-purple-300",
        className
      )} 
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
    </button>
  )
}