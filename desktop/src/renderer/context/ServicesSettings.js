import { createContext, useEffect, useState } from "react";
import { getHash, registerPrintCost } from "../services/xprintjob";
import { useWalletClient } from "wagmi";
import { parseEther, walletClientToSigner } from "../utils";

export const ServicesSettingsContext = createContext();

export default function ServicesSettingsProvider({children}){
    const [services, setServices] = useState([]);
    const {data: walletClient} = useWalletClient()

    const saveServices = (services = []) => {
        setServices(prev => services, localStorage.setItem("services", JSON.stringify(services)));
    }

    const saveOnChain = async (record, spId) => {
        // console.log(record, spId);
        const hash = getHash(`${record.print_color}|${record.orientation}|${record.paper_size}`.toLocaleLowerCase())
        // console.log(hash);
        await registerPrintCost({signer: walletClientToSigner(walletClient), spId: 0, bytes32: hash, unitCost: record.sheet_cost })
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