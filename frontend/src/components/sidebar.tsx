"use client";
import SolanaLogo from "./img/SolanaLogo";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 bottom-0 z-10 h-screen w-[350px] bg-zinc-100 p-10 py-5 border-r border-zinc-200">
      <div className="flex items-center gap-2">
        <SolanaLogo height="18" monoChrome={false} />
        <h1 className="text-lg font-medium tracking-tight text-zinc-700">solbounty</h1>
      </div>
    </div>
  );
}