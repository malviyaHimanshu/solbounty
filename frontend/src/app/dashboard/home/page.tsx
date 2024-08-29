"use client";
import { cn } from "@/lib/utils";
import { coromorantGaramond } from "@/lib/fonts";
import { MedalOutlinedIcon, PlusOutlinedIcon } from "@/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import axios from "axios";
import { Avatar, Skeleton } from "@nextui-org/react";
import SolanaLogo from "@/components/img/SolanaLogo";

// TODO: protect this route
export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>([]);

  useEffect(() => {
    getProfileData();
    getAllTransactions();
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

  // TODO: fetch only some amount of transactions
  const getAllTransactions = async () => {
    const transactions = await axios.get(`${API_URL}/v1/transaction/all`, {
      withCredentials: true,
    });

    try {
      const response = await transactions;
      setTransactions(response.data.data);
      console.log("transactions are here: ", response.data.data);
    } catch {
      console.error('error fetching transactions');
      setTransactions([]);
    }
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
                <p className="text-zinc-500 text-sm">create a new bounty and get it listed on the GitHub.</p>
              </div>
            </div>
          </div>
        </Link>
        
        <Link href={'/dashboard/explore-bounty'}>
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

      <div className="mt-10 gap-5 max-w-[66%]">
        <div className="flex items-center justify-between">
          <p className="text-lg text-zinc-500">Recent earners</p>
          <Link href={'/dashboard/leaderboard'}>
            <p className="text-sm text-violet-500 font-medium">{'Leaderboard ->'}</p>
          </Link>
        </div>

        {!transactions.length ? (
          <div className="mt-5 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="rounded-full w-8 h-8" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="rounded-lg w-32 h-4" />
                  <Skeleton className="rounded-lg w-44 h-4" />
                </div>
              </div>
              <Skeleton className="rounded-lg w-20 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="rounded-full w-8 h-8" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="rounded-lg w-32 h-4" />
                  <Skeleton className="rounded-lg w-44 h-4" />
                </div>
              </div>
              <Skeleton className="rounded-lg w-20 h-6" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="rounded-full w-8 h-8" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="rounded-lg w-32 h-4" />
                  <Skeleton className="rounded-lg w-44 h-4" />
                </div>
              </div>
              <Skeleton className="rounded-lg w-20 h-6" />
            </div>
          </div>
        ): (
          <div className="mt-5 pb-10 flex flex-col gap-5">
            {transactions.map((transaction: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={transaction.to.avatar_url} className="h-8 w-8" />
                  <div className="flex flex-col gap-1.5">
                    <a target="_blank" href={`https://github.com/${transaction.to.github_username}`} className="text-base font-medium text-zinc-800 leading-none hover:underline cursor-pointer">{transaction.to.name ? transaction.to.name : transaction.to.github_username}</a>
                    <a target="_blank" href={transaction.pr_detail.url} className="text-sm text-zinc-500 leading-none hover:underline cursor-pointer">{transaction.pr_detail.title} #{transaction.pr_detail.number}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  { transaction.token === 'SOL' ? <SolanaLogo height="12" /> : ''}
                  <p className="text-zinc-700 font-medium text-base flex items-center gap-1">{transaction.amount} 
                    <span className="text-zinc-500">{transaction.token}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}