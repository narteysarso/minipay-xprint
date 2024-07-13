'use client'

import { State } from 'wagmi'

import { WagmiProvider} from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {  ReactNode, useState } from 'react'
import { getConfig } from '@/lib/config'


export function WalletProvider({children, initialState}: {children: ReactNode, initialState: State|undefined}) {
    const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())
    return (
        <WagmiProvider config={config} initialState={initialState}>
             <QueryClientProvider client={queryClient}>
            {children}
            </QueryClientProvider>
        </WagmiProvider>

    )
}

export default WalletProvider