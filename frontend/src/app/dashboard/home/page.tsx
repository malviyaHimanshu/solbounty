"use client";
import { cn } from "@/lib/utils";
import { coromorantGaramond, instrumentSerif, ptSerif } from "@/lib/fonts";
import { FaceIcon, LightningBoltIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Card } from '@nextui-org/react';
import { useSession } from "next-auth/react";
import { MedalOutlinedIcon, PlusOutlinedIcon } from "@/icons";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Welcome back, {session?.user?.name?.split(' ')[0]}</h1>
      <p className="mt-2 text-zinc-500">create new bounties or explore all open bounties.</p>

      {/* TODO: update ui for these cards */}
      <div className="grid grid-cols-1 gap-5 mt-10 sm:grid-cols-2 lg:grid-cols-3">
        <Link href={'/dashboard/create-bounty'}>
          <div className="border border-zinc-200 rounded-[13px] cursor-pointer outline outline-transparent hover:outline-4 hover:outline-zinc-100 transition-all 0.2s ease-in-out">
            <div className="p-7 space-y-5 bg-zinc-50 border-2 border-white rounded-xl text-start">
              <PlusOutlinedIcon color="#3f3f46" size={45} />
              <div className="flex flex-col gap-1 w-full">
                <h2 className="text-lg font-semibold text-zinc-700">Create a new bounty</h2>
                <p className="text-zinc-500 text-sm">create a new bounty and get it listed on the marketplace.</p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href={'/dashboard/solve-bounties'}>
          <div className="border border-zinc-200 rounded-[13px] cursor-pointer outline outline-transparent hover:outline-4 hover:outline-zinc-100 transition-all 0.2s ease-in-out">
            <div className="p-7 space-y-5 bg-zinc-50 border-2 border-white rounded-xl text-start">
              <MedalOutlinedIcon color="#3f3f46" size={45} />
              <div className="flex flex-col gap-1 w-full">
                <h2 className="text-lg font-semibold text-zinc-700">Explore all bounties</h2>
                <p className="text-zinc-500 text-sm">explore all community bounties and start working on them.</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}