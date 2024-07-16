import { ethers, providers } from 'ethers'
import { fetchJson } from 'ethers/lib/utils'

export const loadIPFSData = async (uri) => {
    
    return await fetchJson(uri)
}

export function walletClientToSigner(walletClient) {
    const { account, chain, transport } = walletClient || {}
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
    return ethers.utils.parseEther(value);
}

export function formatEther(value){
    return ethers.utils.formatEther(value)
}

export function parseBytes32ToString(byteStr){
    return ethers.utils.parseBytes32String(byteStr);
}

export function formatStringToBytes32(str){
    return ethers.utils.formatBytes32String(str);
}