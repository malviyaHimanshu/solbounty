"use client";
import { Tabs, Tab } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();  

  return (
    <div className="fixed top-0 left-0 bottom-0 z-10 h-screen w-[250px] lg:w-[350px] bg-zinc-50 p-5 pt-[110px] pb-5 border-r border-zinc-200">
      <Tabs isVertical={true} variant="light" placement="start" fullWidth onSelectionChange={(key) => router.push(`/dashboard/home`)}>
        <Tab key="home" title="Home" />
        <Tab key="bounties" title="Bounties" />
        <Tab key="profile" title="Profile" />
      </Tabs>
    </div>
  );
}