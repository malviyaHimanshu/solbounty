"use client";
import { API_URL } from "@/lib/constants";
import { coromorantGaramond } from "@/lib/fonts";
import { cn, formateDate, fromNow, shortenAddress } from "@/lib/utils";
import axios from "axios";
import { Avatar, Accordion, AccordionItem, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";

interface Transaction {
  id: number;
  amount: string;
  token: string;
  pr_detail: {
    title: string;
    number: number;
    url: string;
    avatar: string;
  }
  signature: string;
  from: any;
  to: any;
  type: 'sent' | 'received';
  profile: any;
  other_party: any;
  created_at: string;
}

export default function Earnings() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getAllTransactionsOfUser = async () => {
    const transactions = await axios.get(`${API_URL}/v1/transaction`, {
      withCredentials: true,
    });

    try {
      const response = await transactions;
      setTransactions(response.data.data);
      // console.log("transactions are here: ", response.data.data);
    } catch {
      console.error('error fetching transactions');
      setTransactions([]);
    }
  }

  useEffect(() => {
    getAllTransactionsOfUser();
  }, []);

  return (
    <div>
      <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Transactions</h1>
      <p className="mt-2 text-zinc-500">Track all your transactions and bounties.</p>

      {!transactions.length ? (
        <div className="mt-10 p-3 flex flex-col gap-7">
          <div className="flex items-center justify-start gap-5">
            <Skeleton className="rounded-lg w-16 h-16" />
            <div className="flex flex-col gap-2">
              <Skeleton className="rounded-lg w-[400px] h-7" />
              <Skeleton className="rounded-lg w-[350px] h-7" />
            </div>
          </div>
          <div className="flex items-center justify-start gap-5">
            <Skeleton className="rounded-lg w-16 h-16" />
            <div className="flex flex-col gap-2">
              <Skeleton className="rounded-lg w-[400px] h-7" />
              <Skeleton className="rounded-lg w-[350px] h-7" />
            </div>
          </div>
          <div className="flex items-center justify-start gap-5">
            <Skeleton className="rounded-lg w-16 h-16" />
            <div className="flex flex-col gap-2">
              <Skeleton className="rounded-lg w-[400px] h-7" />
              <Skeleton className="rounded-lg w-[350px] h-7" />
            </div>
          </div>
        </div>
      ) : (
        <Accordion className="mt-10">
          {
            transactions.map((transaction, index) => {
              return (
                <AccordionItem key={index} aria-label={`Accordion ${index}`}
              startContent={
                <div className="flex gap-5 items-start">
                  <Avatar src={transaction.pr_detail.avatar} size="lg" radius="sm" isBordered />
                  <div className="text-start">
                    <h1 className={cn("text-xl tracking-tight flex items-center gap-2")}>
                      <span className={cn("font-semibold", transaction.type === 'sent' ? 'text-red-500':'text-green-500')}>{transaction.type === 'sent' ? '-' : '+'} {transaction.amount} {transaction.token}</span>
                      <a target="_blank" href={transaction.pr_detail.url} className="hover:underline cursor-pointer">{transaction.pr_detail.title} <span className="text-zinc-500">#{transaction.pr_detail.number}</span></a>
                    </h1>
                    <p className={cn("text-zinc-500 flex items-center gap-1")}>
                      { transaction.type === 'sent' ? 'Sent to' : 'Received from' }
                      <a target="_blank" href={`https://github.com/${transaction.other_party.github_username}`} className="font-medium hover:underline cursor-pointer flex items-center gap-1 mx-1">
                        <Avatar className="h-4 w-4" src={transaction.other_party.avatar_url} size="sm" />
                        {transaction.other_party.github_username}
                      </a>
                      <span className={cn("text-zinc-500")}>{fromNow(transaction.created_at)}</span>
                    </p>
                  </div>
                </div>
              }
            >
              {(
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <p className="text-zinc-500 text-sm">Date</p>
                    <p className="text-sm">{formateDate(transaction.created_at)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-zinc-500 text-sm">Status</p>
                    <p className="text-sm text-green-500 font-medium">Succeeded</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-zinc-500 text-sm">To</p>
                    <p className="text-sm font-mono">{transaction.to.account_addr}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-zinc-500 text-sm">PR link</p>
                    <a target="_blank" href={transaction.pr_detail.url} className="text-sm underline">{transaction.pr_detail.url}</a>
                  </div>
                  <a target="_blank" href={`https://explorer.solana.com/tx/${transaction.signature}?cluster=devnet`} className="mx-auto my-2 mb-5 text-sm text-zinc-600 border-b-1.5 border-zinc-500 font-medium">view on explorer</a>
                </div>
              )}
            </AccordionItem>
              )
            })
          }
        </Accordion>
      )}
    </div>
  )
}