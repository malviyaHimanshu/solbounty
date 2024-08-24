"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BitgetWalletAdapter,
  TrustWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { AuthProvider } from "@/contexts/auth-context";
require("@solana/wallet-adapter-react-ui/styles.css");

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BitgetWalletAdapter(),
      new TrustWalletAdapter({ network }),
      new CoinbaseWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
