"use client";
import SolanaLogo from "./img/SolanaLogo";
import DynamicBreadcrumbs from "./dynamic-breadcrumbs";
import Link from "next/link";

export default function Header() {

  return (
    <header className="fixed left-0 top-0 right-0 z-10 text-zinc-500 w-full h-[70px] border-b border-white">
      <div className="flex items-center border-y border-zinc-200 h-full">
        <div className="flex items-center px-10 gap-2 w-[250px] lg:w-[350px] h-full bg-zinc-50 border-r border-zinc-200">
          <Link href={'/'}>
            <div className="flex items-center gap-2">
              <SolanaLogo height="18" monoChrome={false} />
              <h1 className="text-lg font-medium tracking-tight text-zinc-700">solbounty</h1>
            </div>
          </Link>
        </div>

        <div className="p-5 px-10">
          <DynamicBreadcrumbs />
        </div>
      </div>
    </header>
  )
}