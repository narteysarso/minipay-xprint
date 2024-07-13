import { createContext } from 'react';
import { getAddress, getAddresscUSDBalance } from '@/lib/utils';
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { celo, Chain } from 'viem/chains';


const MiniPayContext = createContext({});

export function useMiniPay() {
    return useContext(MiniPayContext);
}

export function MinipayProvider({ children }: { children: ReactElement }) {

    const [address, setAddress] = useState(null);
    const [balance, setBalance] = useState(0);
    const [chain, setChain] = useState(celo);


    const changeChain = (chain: Chain) => {
        setChain(prev => chain);
    }
    

    useEffect(() => {
        (async () => {
            try {
                const address = await getAddress();
                setAddress(address);
            } catch (error) {
                alert(error?.message);
            }

        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!address || !chain?.id) return;
            try {
                const balance = await getAddresscUSDBalance(address, chain);
                setBalance(balance)
            } catch (error) {
                alert(error?.message);
            }
        })
    }, [chain, address]);


    return (
        <MiniPayContext.Provider value={{
            address, balance, changeChain
        }}>
            {children}
        </MiniPayContext.Provider>
    )
}
