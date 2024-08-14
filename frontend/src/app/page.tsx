import Button from "@/components/button";
import SolanaLogo from "@/components/img/SolanaLogo";
import LoginWithGitHub from "@/components/login";
import { interTight } from "@/lib/fonts";
import Link from "next/link";

export default async function LandingPage() {

  // TODO: complete landing page
  return (
    <main className="min-h-screen ">
      <header className="flex items-center justify-between p-5 px-14 h-20">
        <h1 className={ interTight.className + " text-xl font-semibold tracking-tight flex items-center gap-2"}>
          <SolanaLogo height="18" color="#18181B" />
          solbounty
        </h1>
        <div className="flex items-center gap-2">
          <Link href={'/login'}>
            <Button color="white">Login</Button>
          </Link>
          <LoginWithGitHub />
        </div>
      </header>

      <div className="flex flex-col px-10">
        <div className="bg-zinc-900 text-zinc-50 text-center rounded-3xl p-10 py-32 flex flex-col items-center gap-5">
          <h1 className={interTight.className + " text-4xl font-medium tracking-tight"}>
            Bounties made simpler with Solana.
          </h1>
          <p className="text-zinc-300 max-w-96">
            put bounties on issues and reward contributors instantly on Solana
            right from GitHub.
          </p>
          <Link href="/dashboard" className="mt-3">
            <Button color="green">{"try now →"}</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
