"use client";
import Button from "@/components/button";
import ConnectWallet from "@/components/connect-wallet";
import SolanaLogo from "@/components/img/SolanaLogo";
import { WalletOutlinedIcon } from "@/icons";
import { API_URL } from "@/lib/constants";
import { coromorantGaramond } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Avatar, Snippet } from "@nextui-org/react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const { connect, disconnect, connected, publicKey, wallet, signMessage } = useWallet();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [updateWallet, setUpdateWallet] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getProfileData();
  }, []);
  
  const getProfileData = async () => {
    await axios.get(`${API_URL}/v1/user/`, {
      withCredentials: true,
    }).then((res) => {
      const userData = res.data.data;
      // console.log(userData);
      setUserProfile(userData);
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
      // console.log("signature: ", signature);
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

  const handleUpdateWallet = async () => {
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

    axios.post(`${API_URL}/v1/user/update`, {
      pubKey: publicKey ? publicKey.toBase58() : userProfile?.account_addr,
      signature,
      message,
    }, {
      withCredentials: true,
    }).then((res) => {
      toast.success("updated wallet successfully!");
      setUpdateWallet(false);
      setIsLoading(false);
    }).catch((err) => {
      console.log(err);
      toast.error("error logging in");
    });
  }

  return (
    <div>
      <h1 className={cn("text-4xl font-semibold tracking-tight text-zinc-700", coromorantGaramond.className)}>Profile</h1>
      <p className="mt-2 text-zinc-500">{"It's all about you :)"}</p>

      <div className="mt-10 flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <Avatar src={userProfile?.avatar_url} size="lg" />
          <div>
            <p className="text-xl font-medium tracking-tight text-zinc-800">{userProfile?.name ? userProfile?.name : userProfile?.github_username}</p>
            { userProfile?.name && <p className="text-base text-zinc-500">{userProfile?.github_username}</p>}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-zinc-500 mb-2 ml-1">Wallet Address</p>
          <Snippet 
            size="lg"
            hideSymbol
            tooltipProps={{
              placement: 'top',
              content: 'Copy address',
            }}
          >
            {publicKey ? publicKey.toBase58() : userProfile?.account_addr}
          </Snippet>
        </div>
        
        { updateWallet ? (
          <>
            <div suppressHydrationWarning>
              <ConnectWallet />
            </div>

            <Button color="black" onClick={handleUpdateWallet} className={cn("w-fit flex items-center gap-2", publicKey ? "": "pointer-events-none cursor-not-allowed opacity-70")}>
              <WalletOutlinedIcon color="white" size={18} />
              Verify & Update
            </Button>
          </>
        ) : (
          <Button color="black" onClick={() => setUpdateWallet(true)} className={cn("w-fit flex items-center gap-2")}>
            <WalletOutlinedIcon color="white" size={18} />
            Update Wallet
          </Button>
        )}
        
        
      </div>
    </div>
  )
}