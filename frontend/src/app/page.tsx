import Button from "@/components/button";
import CallToAction from "@/components/call-to-action";
import GitHubLogo from "@/components/img/GitHubLogo";
import SolanaLogo from "@/components/img/SolanaLogo";
import LoginButton from "@/components/login-button";
import { interTight } from "@/lib/fonts";
import solanaLogo from "/public/solana.svg";
import Image from "next/image";
import backgroundImage from '/public/bg2.png';

export default async function LandingPage() {

  // TODO: complete landing page
  return (
    <main className="min-h-screen ">
      <header className="flex items-center justify-between p-5 px-14 h-20">
        <h1 className={ interTight.className + " text-xl font-semibold tracking-tight flex items-center gap-2"}>
          {/* <SolBountyLogo /> */}
          <SolanaLogo color="#18181B" />
          solbounty
        </h1>
        <LoginButton />
      </header>

      <div className="flex flex-col px-10">
        <div className="text-zinc-800 text-center rounded-3xl p-10 py-20 flex flex-col items-center gap-5">
          <h1 className={interTight.className + " pointer-events-none text-8xl font-medium tracking-tight flex text-wrap flex-wrap items-center justify-center gap-5 max-w-[1000px]"}>
            Bounties on 
            <span className="flex items-center gap-3 w-fit">
              <GitHubLogo monoChrome={true} color="#27272a" height="75" /> GitHub 
            </span>
            with <span className="flex items-center gap-3"><Image src={solanaLogo} height={72} width={72} alt="" /> Solana</span>
          </h1>
          <p className="text-zinc-600 max-w-96 mt-3">
            reward contributors with bounties instantly on Solana
            right from GitHub.
          </p>
          <CallToAction />
        </div>
      </div>

      <div className="w-full object-cover">
        <Image src={backgroundImage} alt="background" className="h-full w-full" />
      </div>
    </main>
  );
}
