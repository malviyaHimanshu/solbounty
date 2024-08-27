"use client";
import ConnectWallet from "@/components/connect-wallet";
import SolanaLogo from "@/components/img/SolanaLogo";
import { useWallet } from "@solana/wallet-adapter-react";
import { Chip } from "@nextui-org/react";
import { useEffect } from "react";
import { coromorantGaramond } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function Solve() {
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      const pubKeyString = publicKey.toString();
      console.log(`Connected to wallet with public key: ${pubKeyString}`);
    }
  }, [connected, publicKey]);

  return (
    <div>
      {/* <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Solve bounties</h1>
      <p className="mt-2 text-zinc-500">Explore all bounties and start working on them.</p> */}
      
      <div className="flex flex-col gap-5 h-96">
        <div className="border border-zinc-200 transition-all 0.2s ease-in-out rounded-[13px] h-full grid place-content-center">

          <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Coming soon</h1>
          <p className="text-zinc-500 mt-2">I'm working on this to deliver the best experience for you and will be releasing soon.</p>

        </div>
      </div>
    </div>
  )
}