import { providers } from 'ethers'
import { formatUnits, parseUnits } from 'viem'

export const loadIPFSData = async (uri) => {
    
    const response = await fetch(uri);

    const result = await response.json()

    return result;
}

export function walletClientToSigner(walletClient) {
    
    const { account, chain, transport } = walletClient
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new providers.Web3Provider(transport, network)
    const signer = provider.getSigner(account.address)
    return signer
}

export function parseEther(value){

    return parseUnits(value, 18);
}

export function formatEther(value){
    return formatUnits(value, 18)
}