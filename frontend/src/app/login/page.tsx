"use client";
import Button from "@/components/button"
import SolanaLogo from "@/components/img/SolanaLogo"
import { LoginIcon } from "@/icons"
import { instrumentSerif, inter, interTight } from "@/lib/fonts"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { User } from "@nextui-org/react";
import ConnectWallet from "@/components/connect-wallet";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";

export default function LoginPage() {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const [pubKey, setPubKey] = useState<string | null>(null);
  
  // TODO: update the github to get the gitgub username as well
  const [profile, setProfile] = useState<any>(null);
  const [status, setStatus] = useState<'authenticated' | 'unauthenticated'>('unauthenticated')

  const handleClick = () => {
    window.location.href = `${API_URL}/v1/auth/github`;
  }

  useEffect(() => {
    getProfileData();
  }, []);

  useEffect(() => {
    if(connected && publicKey) {
      setPubKey(publicKey.toBase58());
      console.log("public key: ", publicKey.toBase58());
    }
  }, [connected, publicKey]);

  const getProfileData = async () => {
    await axios.get(`${API_URL}/v1/user/profile`, {
      withCredentials: true,
    }).then((res) => {
      const userData = res.data.data;
      console.log(userData);
      setProfile(userData);
      setStatus('authenticated');
    }).catch((err) => {
      console.log(err);
    });
  }

  // TODO: connect wallet and take the public key from the user
  const handleLogin = () => {
    if(!connected || !publicKey) {
      console.error("no wallet connected");
      return;
    }

    axios.post(`${API_URL}/v1/auth/register`, {
      pubKey: pubKey,
    }, {
      withCredentials: true,
    }).then((res) => {
      console.log("register data: ", res.data);
      router.push('/dashboard');
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <main className={inter.className + " max-h-screen min-h-screen h-screen flex overflow-hidden fixed top-0 left-0 right-0 bottom-0"}>
      <div className="h-full w-1/2 bg-zinc-100 p-10 hidden sm:flex flex-col items-start justify-between">
        <Link href={'/'}>  
          <h1 className={ interTight.className + " text-2xl text-zinc-700 font-semibold tracking-tight flex items-center gap-2"}>
            <SolanaLogo height="20" color="#3f3f46" />
            solbounty
          </h1>
        </Link>

        <p className="text-sm text-zinc-600 flex items-center gap-1">
          made with ❤️ by <a href="https://x.com/himanhacks" className="text-zinc-700"><span className="font-mono underline">himanhacks</span></a>
        </p>
      </div>

      <div className="h-full w-full sm:w-1/2 grid place-content-center p-10">
        <div>
          <h1 className={ instrumentSerif.className + " text-5xl font-semibold text-zinc-700"}>fork it.</h1>
          { status === 'unauthenticated' && (
            <div>
              <p className="text-zinc-500 mt-1">login to your account to continue.</p>
              <Button onClick={handleClick} color="black" className="flex items-center justify-center gap-2 my-5 mb-20">
                <GitHubLogoIcon />
                Sign in with GitHub
              </Button>
            </div>
          )}
          
          { status === 'authenticated' && (
            <div className="flex flex-col items-start gap-7 mt-7">
              {profile && (
                <User 
                  name={profile?.name}
                  description={profile?.login}
                  avatarProps={{
                    src: profile?.avatar_url as string,
                  }}
                />
              )}
              
              <hr className="w-full border-t border-zinc-300" />
              <div>
                <p className="text-zinc-500 mb-4">connect wallet to continue.</p>
                <ConnectWallet />
              </div>
              
              <Button onClick={handleLogin} color="black" className="flex items-center justify-center gap-2 my-5">
                <LoginIcon color="#fff" />
                Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}