import { createContext, useContext, useEffect, useState } from "react";
import { getServiceProviderId, registerServiceProvider, getBalance, withdrawCost } from "../services/xprintjob";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../utils";

const availabilityEnum = {
    "online": 0,
    "offline": 1
}


export const BusinessSettingsContext = createContext({});

export function useBusiness(){
    return useContext(BusinessSettingsContext);
}


export default function BusinessSettingsProvider({ children }) {

    const [spId, setSPId] = useState(undefined);
    const [companyName, setCompanyName] = useState(undefined);
    const [location, setLocation] = useState(undefined);
    const [availability, setAvailability] = useState(undefined);
    const [balance, setBalance] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setError] = useState(undefined);
    const { data: walletClient } = useWalletClient();
    const { isConnected } = useAccount();

    const saveCompanyName = (companyName = "") => {
        setCompanyName(prev => companyName, localStorage.setItem("companyName", companyName))
    }
    const saveLocation = (location = "") => setLocation(prev => location, localStorage.setItem("location", JSON.stringify(location)))

    const saveAvailability = (availability = "") => setAvailability(prev => availability, localStorage.setItem("availability", availability))

    const getAccountBalance = async () => await getBalance({signer: walletClientToSigner(walletClient)});

    const withdrawPrintCost = async () => await withdrawCost({signer: walletClientToSigner(walletClient)});

    const validData = () => {
        return (!companyName || !location || !availability);
    }

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                saveLocation(position)
            });
          } else {
            alert("Geolocation is not supported by this browser.");
          }
    }

    const registerService = async () => {
        try {
            setLoading(true);
            if (!validData())
                await registerServiceProvider({ signer: walletClientToSigner(walletClient), name: companyName, availability: availabilityEnum[availability], location });
        } catch (error) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        // getServiceProviderId(walletClientToSigner(walletClient))
        if (!isConnected || !walletClient?.account) return;
        (async() => {
            const balance = await getAccountBalance();
            setCompanyName(localStorage.getItem("companyName"));
            setLocation(JSON.parse(localStorage.getItem("location")));
            setAvailability(localStorage.getItem("availability"));
            setBalance(balance);
        })()
    }, [isConnected,walletClient]);

    // useEffect(() => {

    // });
 

    // useEffect(() => {
    //     (async () => {
    //         if (isConnected && walletClient?.account) {
    //             const [serviceProviders, balance] = await Promise.all([getServiceProviderId(walletClientToSigner(walletClient)),])
    //             const info = serviceProviders.pop();
    //             if (!info) return;
    //             const { args } = info;
                
    //             // setSPId(args.pID.toString());
    //             setCompanyName(args.name);
    //             setLocation(args.location);
    //             setAvailability(localStorage.getItem("availability"));
    //             
                
    //         }
    //     })()

    // }, [isConnected, walletClient]);


    return (
        <BusinessSettingsContext.Provider value={{
            companyName,
            location,
            availability,
            loading,
            errorMsg,
            spId,
            balance,
            saveCompanyName,
            getLocation,
            saveLocation,
            saveAvailability,
            registerService,
            validData,
            getAccountBalance,
            withdrawPrintCost
        }}>
            {children}
        </BusinessSettingsContext.Provider>
    )
}