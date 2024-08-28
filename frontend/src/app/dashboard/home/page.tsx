"use client";
import { cn } from "@/lib/utils";
import { coromorantGaramond, instrumentSerif, ptSerif } from "@/lib/fonts";
import { MedalOutlinedIcon, PlusOutlinedIcon } from "@/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import axios from "axios";

// TODO: protect this route
export default function Home() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    await axios.get(`${API_URL}/v1/user/profile`, {
      withCredentials: true,
    }).then((res) => {
      const userData = res.data.data;
      // console.log(userData);
      setProfile(userData);
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <>
      <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Welcome back 
        {profile ? (
          profile?.name ? `, ${profile.name.split(" ")[0]}` : `, ${profile.login}`
        ) : ''}
      </h1>
      <p className="mt-2 text-zinc-500">create new bounties or explore all open bounties.</p>

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