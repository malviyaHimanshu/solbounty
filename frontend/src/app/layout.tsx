import type { Metadata } from "next";
import { inter } from "@/lib/fonts";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "solbounty",
  description: "bounties made simpler with solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster 
            position="bottom-right"
            reverseOrder={false}
            toastOptions={{
              className: "rounded-lg",
              style: {
                background: "#FAFEFD",
                color: "#18181B",
                fontSize: "14px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
