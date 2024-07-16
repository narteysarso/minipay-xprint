import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import celoGroups from "@celo/rainbowkit-celo/lists";
import Layout from "../components/Layout";
import "@rainbow-me/rainbowkit/styles.css";
import { publicProvider } from "wagmi/providers/public";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import AllContexts from "../context";
import { projectId, thirdweb_clientId, thirdweb_secret } from "../constant/env";
import { ThirdwebProvider } from "@thirdweb-dev/react";


const { chains, publicClient } = configureChains(
    [Alfajores, Celo],
    [publicProvider()]
);

const connectors = celoGroups({
    chains,
    projectId: projectId,
    appName: (typeof document === "object" && document.title) || "XPrint",
});

const appInfo = {
    appName: "Celo Composer",
};

const wagmiConfig = createConfig({
    connectors,
    publicClient: publicClient,
});

function App({ Component, pageProps }) {
    return (

        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider
                chains={chains}
                appInfo={appInfo}
                coolMode={true}
            >
                <ThirdwebProvider clientId={thirdweb_clientId} secretKey={thirdweb_secret}>
                <AllContexts>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </AllContexts>
                </ThirdwebProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}

export default App;
