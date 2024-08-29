"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HomeOutlinedIcon, MedalOutlinedIcon, PlusOutlinedIcon, SearchOutlinedIcon, UserCircleOutlinedIcon } from "@/icons";
import { CurrencyIcon } from "@/icons/currency-icon";

interface Menu {
  label: string;
  href: string;
  icon: JSX.Element;
  iconActive?: JSX.Element;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menu: Menu[] = [
    { label: 'Home', href: '/dashboard/home', icon: <HomeOutlinedIcon color="#71717a"  />, iconActive: <HomeOutlinedIcon color="#3f3f46" /> },
    { label: 'Create bounty', href: '/dashboard/create-bounty', icon: <PlusOutlinedIcon color="#71717a" />, iconActive: <PlusOutlinedIcon color="#3f3f46" /> },
    { label: 'Explore bounty', href: '/dashboard/explore-bounty', icon: <SearchOutlinedIcon color="#71717a" />, iconActive: <SearchOutlinedIcon color="#3f3f46" /> },
    { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <MedalOutlinedIcon color="#71717a" />, iconActive: <MedalOutlinedIcon color="#3f3f46" /> },
    { label: 'Transactions', href: '/dashboard/transactions', icon: <CurrencyIcon color="#71717a" />, iconActive: <CurrencyIcon color="#3f3f46" /> },
    { label: 'Profile', href: '/dashboard/profile', icon: <UserCircleOutlinedIcon color="#71717a" />, iconActive: <UserCircleOutlinedIcon color="#3f3f46" /> },
  ]

  return (
    <div className="fixed flex flex-col top-0 left-0 bottom-0 z-10 h-screen w-[250px] lg:w-[350px] bg-zinc-50 p-10 pt-[110px] pb-5 border-r border-zinc-200">
      <div>
        <p className="text-xs text-zinc-500 py-1.5 px-2">menu</p>
        <div className="mt-1 flex flex-col gap-1">
          { menu.map((item, index) => (
            <Link href={item.href} key={index}>
              <div className={cn(
                "flex items-center gap-2.5 py-1.5 px-2 text-sm border border-transparent hover:bg-zinc-100 transition-all 0.2s ease-in-out rounded-lg",
                pathname === item.href ? 'text-zinc-700 border-zinc-200 bg-zinc-100' : 'font-normal text-zinc-500'
              )}>
                { pathname === item.href ? item.iconActive : item.icon }
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}