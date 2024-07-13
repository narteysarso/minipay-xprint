import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getContract, formatEther, createPublicClient, http, erc20Abi, Chain, encodeFunctionData, parseUnits } from "viem";
import { createWalletClient, custom } from 'viem'
import { PageSizes, PDFDocument } from 'pdf-lib';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getAddress = async () => {
  // The code must run in a browser environment and not in node environment
  if (window && window.ethereum) {
    // User has a injected wallet

    if (window.ethereum.isMiniPay) {
      // User is using Minipay

      // Requesting account addresses
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [],
      });

      // Injected wallets inject all available addresses,
      // to comply with API Minipay injects one address but in the form of array
      return accounts[0];
    }

    // User is not using MiniPay
    return null;
  }
}

export const getAddresscUSDBalance = async (address: `0x${string}`, chain: Chain) => {


  const STABLE_TOKEN_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });
  let StableTokenContract = getContract({
    abi: erc20Abi,
    address: STABLE_TOKEN_ADDRESS,
    publicClient,
  });

  let balanceInBigNumber = await StableTokenContract.read.balanceOf([
    address,
  ]);

  let balanceInWei = balanceInBigNumber.toString();

  let balanceInEthers = formatEther(balanceInWei);

  return balanceInEthers;
}

export const transfercUSD = async ({senderAddress, tokenAddress, receiverAddress, tokenDecimals, transferValue, chain}: {senderAddress: `0x${string}`,tokenAddress: `0x${string}`, receiverAddress: `0x${string}`, transferValue: BigInt, tokenDecimals: number, chain: Chain}) => {
  const client = createWalletClient({
    chain,
    // chain: celo,
    transport: custom(window.ethereum!)
  })
  
  const publicClient = createPublicClient({ 
    chain,
    // chain: celo,
    transport: http()
  })
  let hash = await client.sendTransaction({
    account: senderAddress,
    to: tokenAddress,
    // to: '0x765DE816845861e75A25fCA122bb6898B8B1282a' // cUSD (Mainnet)
    // to: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C' // USDC (Mainnet)
    // to: '0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e' // USDT (Mainnet)
    data: encodeFunctionData({
      abi: erc20Abi, // Token ABI can be fetched from Explorer.
      functionName: "transfer",
      args: [
        receiverAddress,
        // Different tokens can have different decimals, cUSD (18), USDC (6)
        parseUnits(`${Number(transferValue)}`, tokenDecimals),
      ],
    }),
    // If the wallet is connected to a different network then you get an error.
    chain,
    // chain: celo,
  });

  const transaction = await publicClient.waitForTransactionReceipt({
    hash, // Transaction hash that can be used to search transaction on the explorer.
  });

  if (transaction.status === "success") {
    // Do something after transaction is successful.
    return transaction.transactionHash;
  } else {
    // Do something after transaction has failed.
    throw new Error("Transaction failed");
  }
}

export const transfercUSDFrom = async({fromAddress, tokenAddress, toAddress, tokenDecimals, transferValue, chain}: {fromAddress: `0x${string}`,tokenAddress: `0x${string}`, toAddress: `0x${string}`, transferValue: BigInt, tokenDecimals: number, chain: Chain}) => {
  const client = createWalletClient({
    chain,
    transport: custom(window.ethereum!)
  })
  
  const publicClient = createPublicClient({ 
    chain,
    // chain: celo,
    transport: http()
  })
  let hash = await client.sendTransaction({
    account: toAddress,
    to: tokenAddress,
    // to: '0x765DE816845861e75A25fCA122bb6898B8B1282a' // cUSD (Mainnet)
    // to: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C' // USDC (Mainnet)
    // to: '0x48065fbbe25f71c9282ddf5e1cd6d6a887483d5e' // USDT (Mainnet)
    data: encodeFunctionData({
      abi: erc20Abi, // Token ABI can be fetched from Explorer.
      functionName: "transferFrom",
      args: [
        fromAddress,
        toAddress,
        // Different tokens can have different decimals, cUSD (18), USDC (6)
        parseUnits(`${Number(transferValue)}`, tokenDecimals),
      ],
    }),
    // If the wallet is connected to a different network then you get an error.
    chain,
    // chain: celo,
  });

  const transaction = await publicClient.waitForTransactionReceipt({
    hash, // Transaction hash that can be used to search transaction on the explorer.
  });

  if (transaction.status === "success") {
    // Do something after transaction is successful.
    return transaction.transactionHash;
  } else {
    // Do something after transaction has failed.
    throw new Error("Transaction failed");
  }
}

export const readFile = (file) : Promise<ArrayBuffer|string|null>  => {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);

    reader.readAsArrayBuffer(file);
  });
}

export const getPDFPageCount = async (file) => {

  const arrayBuffer = await readFile(file) as ArrayBuffer|string;

  const pdf = await PDFDocument.load(arrayBuffer);

  return pdf.getPageCount();
}
