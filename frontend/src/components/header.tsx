"use client";
import SolanaLogo from "./img/SolanaLogo";
import DynamicBreadcrumbs from "./dynamic-breadcrumbs";
import Link from "next/link";
import { Avatar } from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/constants";

export default function Header() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getProfileData();
  }, []);

  const getProfileData = async () => {
    await axios.get(`${API_URL}/v1/user/profile`, {
      withCredentials: true,
    }).then((res) => {
      const userData = res.data.data;
      console.log(userData);
      setProfile(userData);
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <header className="fixed left-0 top-0 right-0 z-30 text-zinc-500 w-full h-[70px] border-b border-white bg-white/30 backdrop-blur-md">
      <div className="flex items-center border-y border-zinc-200 h-full">
        <div className="flex items-center px-10 gap-2 w-[250px] lg:w-[350px] h-full bg-zinc-50 border-r border-zinc-200">
          <Link href={'/'}>
            <div className="flex items-center gap-2">
              <SolanaLogo height="18" monoChrome={false} />
              <h1 className="text-lg font-medium tracking-tight text-zinc-700">solbounty</h1>
              <div className="hidden lg:block py-[1px] px-[5px] text-[10px] font-medium rounded-md bg-green-100 text-green-600 border border-green-500">early access</div>
            </div>
          </Link>
        </div>

        <div className="p-5 px-10 flex items-center justify-between w-[calc(100vw-250px)] lg:w-[calc(100vw-350px)]">
          <DynamicBreadcrumbs />
          <Avatar name={`${profile?.name}`} src={`${profile?.avatar_url}`} size="sm" />
        </div>
      </div>
    </header>
  )
}