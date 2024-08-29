"use client";
import { coromorantGaramond } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function Solve() {

  return (
    <div>
      <div className="flex flex-col gap-5 h-96">
        <div className="border border-zinc-200 p-10 transition-all 0.2s ease-in-out rounded-[13px] h-full grid place-content-center">
          <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Coming soon...</h1>
          <p className="text-zinc-500 mt-2">{"I'm working on this to deliver the best experience for you and will be releasing soon."}</p>
        </div>
      </div>
    </div>
  )
}