import { createContext, useEffect, useState } from "react";
import { getHash, registerPrintCost, registerPrinter } from "../services/xprintjob";
import { useWalletClient } from "wagmi";
import { formatStringToBytes32, parseEther, walletClientToSigner } from "../utils";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useBusiness } from "./BusinessSettings";

export const ServicesSettingsContext = createContext();

export default function ServicesSettingsProvider({children}){
    const [services, setServices] = useState([]);
    const {companyName, location} = useBusiness();
    const {data: walletClient} = useWalletClient();
    const {mutateAsync: upload, isLoading} = useStorageUpload()

    const saveServices = (services = []) => {
        setServices(prev => services, localStorage.setItem("services", JSON.stringify(services)));
    }

    const saveOnChain = async (record) => {
        // TODO: save to ipfs
        const serviceDetails = {
            name: `${record.print_color}|${record.orientation}|${record.paper_size}`,
            description: `${record.print_color} ${record.orientation} ${record.paper_size}`,
            attributes: [
                {
                    trait: 'company',
                    value: companyName,
                },
                {
                    trait: 'price',
                    value: record.sheet_cost,
                },
                {
                    trait: 'company',
                    value: companyName,
                },
                {
                    trait: 'location',
                    value: location,
                },
                {
                    trait: 'paperSize',
                    value: record.paper_size,
                },
            ]
        }

        const metaData = JSON.stringify(serviceDetails);
        // return;

        const result = await upload({
            data: [new File([metaData], `${Date.now()}.json`)],
            options: { uploadWithGatewayUrl: true, uploadWithoutDirectory: true },
        });

        const uploadUrl = result[0];
        
        const ipfsCID = uploadUrl.split('ipfs/')[1]?.substring(0, uploadUrl.length-1);
        const hash = getHash(ipfsCID);

        const signer = walletClientToSigner(walletClient)

        const txn = await registerPrinter({signer, printerHash: hash, owner: signer._address, cid: ipfsCID} );

        return txn;
    }

    useEffect(()=>{
        setServices(prev => JSON.parse(localStorage.getItem("services") || "[]") );
    },[])

    return (
        <ServicesSettingsContext.Provider value={{
            services,
            saveServices,
            saveOnChain
        }}>
            {children}
        </ServicesSettingsContext.Provider>
    )
}