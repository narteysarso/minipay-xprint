import {
    getDefaultConfig,
    getWalletConnectConnector,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    celo,
    celoAlfajores,
    localhost
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";

import BusinessSettingsProvider from "./BusinessSettings";
import JobsProvider from "./Jobs";
import PrinterSettingsProvider from "./PrinterSettings";
import ServicesSettingsProvider from "./ServicesSettings";

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig } from 'wagmi';
import {
    metaMaskWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';


const valoraWallet = ({ chains, projectId }) => ({
    id: "valora",
    name: "Valora",
    iconUrl:
        "https://explorer-api.walletconnect.com/v3/logo/md/a03bfa44-ce98-4883-9b2a-75e2b68f5700?projectId=2f05ae7f1116030fde2d36508f472bfb",
    iconBackground: "#FFF",
    downloadUrls: {
        android: "https://play.google.com/store/apps/details?id=co.clabs.valora",
        ios: "https://apps.apple.com/app/id1520414263?mt=8",
        qrCode: "https://valoraapp.com/",
    },
    mobile: {
        getUri: (uri) => uri,
    },
    qrCode: {
        getUri: (uri) => uri,
        instructions: {
            learnMoreUrl: "https://valoraapp.com/learn",
            steps: [
                {
                    description:
                        "The crypto wallet to buy, send, spend, earn, and collect NFTs on the Celo blockchain.",
                    step: "install",
                    title: "Open the Valora app",
                },
                {
                    description:
                        "After you scan, a connection prompt will appear for you to connect your wallet.",
                    step: "scan",
                    title: "Tap the scan button",
                },
            ],
        },
    },
    createConnector: getWalletConnectConnector({ projectId }),
})

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [metaMaskWallet, walletConnectWallet, valoraWallet],
        },
    ],
    { appName: 'RainbowKit App', projectId: 'YOUR_PROJECT_ID' },
);

const config = createConfig({
    connectors,
    projectId: 'YOUR_PROJECT_ID',
    chains: [celo, celoAlfajores, localhost],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

// const config = getDefaultConfig({
//     appName: 'Xprint',
//     projectId: '925ec9b5e040ff21f94ceb2ee69d011a',
//     chains: [celo, celoAlfajores],
//     ssr: true, // If your dApp uses server side rendering (SSR)
// });

const queryClient = new QueryClient();
export default function AllContexts({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <BusinessSettingsProvider>
                        <PrinterSettingsProvider>
                            <ServicesSettingsProvider>
                                <JobsProvider>
                                    {children}
                                </JobsProvider>
                            </ServicesSettingsProvider>
                        </PrinterSettingsProvider>
                    </BusinessSettingsProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}