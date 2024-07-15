'use client'

import { MinipayProvider } from '@/hooks/minipay-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { celo, celoAlfajores, localhost } from 'wagmi/chains'
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

export const config = createConfig({
  chains: [celo, celoAlfajores, localhost],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
    [localhost.id]: http(),
  },
})


const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MinipayProvider>
          <ThirdwebProvider clientId={process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT_ID} secretKey={process.env.NEXT_PUBLIC_THIRD_WEB_SECRET}>
            <RainbowKitProvider>
            {children}
            </RainbowKitProvider>
          </ThirdwebProvider>
        </MinipayProvider>
      </QueryClientProvider>
    </WagmiProvider>

  );
}
