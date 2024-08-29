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
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import backgroundImage from '/public/bg.png';
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { publicKey, signMessage, connected } = useWallet();
  const [pubKey, setPubKey] = useState<string>();
  const [signature, setSignature] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [status, setStatus] = useState<'authenticated' | 'unauthenticated'>('unauthenticated');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
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

  const handleSignTransaction = async () => {
    if(!publicKey || !signMessage) {
      console.error("no wallet connected");
      return;
    }

    const message = `${window.location.origin} wants you to sign and verify your account for ${publicKey.toBase58()}`;
    const encodedMessage = new TextEncoder().encode(message);

    try {
      const signatureBuffer = await signMessage(encodedMessage);
      const signature = Buffer.from(signatureBuffer).toString('base64');
      console.log("signature: ", signature);
      if(!signature) {
        throw new Error("no signature found");
      }
      setSignature(signature);
      return {
        signature,
        message,
      };
    } catch (error) {
      console.error("error signing transaction: ", error);
      return null;
    }
  }

  // login a new user
  const handleLogin = async () => {
    setIsLoading(true);

    if(!connected || !publicKey) {
      toast.error("no wallet connected");
      return;
    }

    const response = await handleSignTransaction();
    if(!response) {
      toast.error("error signing transaction");
      return;
    }

    const { signature, message } = response;

    axios.post(`${API_URL}/v1/auth/register`, {
      pubKey,
      signature,
      message,
    }, {
      withCredentials: true,
    }).then((res) => {
      console.log("register data: ", res.data);
      toast.success("logged in successfully!");
      router.push('/dashboard');
    }).catch((err) => {
      console.log(err);
      toast.error("error logging in");
    });
  }

  return (
    <main className={inter.className + " max-h-screen min-h-screen h-screen flex overflow-hidden fixed top-0 left-0 right-0 bottom-0"}>
      <div className="h-full w-1/2 relative p-10 hidden sm:flex flex-col items-start justify-between">
        <div className="absolute -z-10 top-0 right-0 bottom-0 left-0">
          <Image src={backgroundImage} alt="background" className="h-full object-cover" />
        </div>

        <Link href={'/'}>  
          <h1 className={ interTight.className + " text-2xl text-zinc-700 font-semibold tracking-tight flex items-center gap-2"}>
            <SolanaLogo height="20" color="#3f3f46" />
            solbounty
          </h1>
        </Link>
      </div>

      <div className="h-full w-full sm:w-1/2 grid place-content-center p-10 relative">
        <div>
          <h1 className={ instrumentSerif.className + " text-5xl font-semibold text-zinc-700"}>fork it.</h1>
          { status === 'unauthenticated' && (
            <div>
              <p className="text-zinc-500 mt-1">login to your account to continue.</p>
              <Button onClick={handleClick} color="black" className={cn("flex items-center justify-center gap-2 my-5 mb-20",
                isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer opacity-100"
              )}>
                <GitHubLogoIcon />
                { isLoading ? 'Loading...' : 'Sign in with GitHub'}
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
                { !publicKey && <p className="text-zinc-500 mb-4">connect wallet to continue.</p>}
                <ConnectWallet />
              </div>
              
              <Button onClick={handleLogin} color="black" className={cn("flex items-center justify-center gap-2 my-5",
                isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer opacity-100"
              )}>
                <LoginIcon color="#fff" />
                { isLoading ? 'Loading...' : 'Sign in'}
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-400 flex items-center gap-2 font-mono absolute bottom-10 left-1/2 -translate-x-1/2">
          made with love by <a href="https://x.com/himanhacks" className="text-zinc-400"><span className="font-mono">@himanhacks</span></a>
        </p>
      </div>
    </main>
  )
}