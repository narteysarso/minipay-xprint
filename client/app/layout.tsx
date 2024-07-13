import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import WalletProvider from "@/hooks/wagmi-provider";
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { getConfig } from "@/lib/config";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "XPrint",
  description: "Print your document anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie')
  )

  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <WalletProvider initialState={initialState}>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
