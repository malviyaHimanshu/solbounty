import { cn } from "@/lib/utils";
import { coromorantGaramond, instrumentSerif, ptSerif } from "@/lib/fonts";
import { FaceIcon, LightningBoltIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Card } from '@nextui-org/react';

export default function Home() {
  return (
    <>
      <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Welcome back, Himanshu</h1>
      <p className="mt-2 text-zinc-500">create new bounties or explore all open bounties.</p>

      {/* TODO: update ui for these cards */}
      <div className="grid grid-cols-1 gap-3 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4 space-y-4 bg-zinc-50 text-start" shadow="sm" disableRipple isPressable>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-zinc-700">Create a new bounty</h2>
            <PlusCircledIcon className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-zinc-500">Create a new bounty and get it listed on the marketplace.</p>
        </Card>

        <Card className="p-4 space-y-4 bg-zinc-50 text-start" shadow="sm" disableRipple isPressable>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-zinc-700">Explore all bounties</h2>
            <LightningBoltIcon className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-zinc-500">Explore all open bounties and start working on them.</p>
        </Card>

        <Card className="p-4 space-y-4 bg-zinc-50 text-start" shadow="sm" disableRipple isPressable>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-lg font-semibold text-zinc-700">Your profile</h2>
            <FaceIcon className="w-6 h-6 text-zinc-500" />
          </div>
          <p className="text-zinc-500">View and edit your profile and settings.</p>
        </Card>
      </div>
    </>
  )
}