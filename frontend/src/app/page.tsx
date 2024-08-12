import Button from "@/components/button";
import SolanaLogo from "@/components/img/SolanaLogo";
import Link from "next/link";

export default function LandingPage() {
  // TODO: complete landing page
  return (
    <main className="min-h-screen ">
      <header className="flex items-center justify-between p-5 px-14">
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <SolanaLogo height="18" color="#18181B" />
          solbounty
        </h1>
        <Button color="black">{"connect wallet"}</Button>
      </header>

      <div className="flex flex-col px-10">
        <div className="bg-zinc-900 text-zinc-50 text-center rounded-3xl p-10 py-32 flex flex-col items-center gap-5">
          <h1 className="text-3xl font-medium tracking-tight">
            Bounties made simpler with Solana.
          </h1>
          <p className="text-zinc-300 max-w-96">
            put bounties on issues and reward contributors instantly on Solana
            right from GitHub.
          </p>
          <Link href="/dashboard">
            <Button color="green">{"try now →"}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
