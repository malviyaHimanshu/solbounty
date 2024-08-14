"use client";
import ConnectWallet from "@/components/connect-wallet";
import SolanaLogo from "@/components/img/SolanaLogo";
import { useWallet } from "@solana/wallet-adapter-react";
import { Chip } from "@nextui-org/react";
import { useEffect } from "react";

export default function Solve() {
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      const pubKeyString = publicKey.toString();
      console.log(`Connected to wallet with public key: ${pubKeyString}`);
    }
  }, [connected, publicKey]);

  return (
    <div className="flex flex-col gap-5" suppressHydrationWarning>
      <div className="border border-zinc-200 transition-all 0.2s ease-in-out rounded-[13px]">
        <div className="flex items-center justify-between transition-all 0.2s ease-in-out border-2 border-white p-7 rounded-xl">
          <div className="flex items-center gap-5">
            <SolanaLogo height="33px" />
            <div>
              <h1 className="text-xl font-medium text-zinc-800 flex items-center gap-2">
                Connect Wallet
                { connected && <Chip color="success" variant="flat">connected</Chip>}
                { !connected && <Chip color="danger" variant="flat">disconnected</Chip>}
              </h1>
              <p className="text-zinc-600 text-sm mt-0.5">Connect your Solana based wallet to receive payouts.</p>
            </div>
          </div>
          <ConnectWallet />
        </div>
      </div>
    </div>
  )
}