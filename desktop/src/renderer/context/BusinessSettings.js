import { createContext, useEffect, useState } from "react";
import { getServiceProviderId, registerServiceProvider, getBalance, withdrawCost } from "../services/xprintjob";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../utils";

const availabilityEnum = {
    "online": 0,
    "offline": 1
}


export const BusinessSettingsContext = createContext({
    companyName: "",
    location: "",
    availability: ""
});


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
        console.log(companyName);
        setCompanyName(prev => companyName, localStorage.setItem("companyName", companyName))
    }
    const saveLocation = (location = "") => setLocation(prev => location, localStorage.setItem("location", location))

    const saveAvailability = (availability = "") => setAvailability(prev => availability, localStorage.setItem("availability", availability))

    const getAccountBalance = async () => await getBalance({signer: walletClientToSigner(walletClient)});

    const withdrawPrintCost = async () => await withdrawCost({signer: walletClientToSigner(walletClient)});

    const validData = () => {
        return (!companyName || !location || !availability);
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

    // useEffect(() => {
    //     setCompanyName(localStorage.getItem("companyName"));
    //     setLocation(localStorage.getItem("location"));
    //     setAvailability(localStorage.getItem("availability"));
    // }, []);

    // useEffect(() => {

    // });

    useEffect(() => {
        (async () => {
            if (isConnected && walletClient?.account) {
                const [serviceProviders, balance] = await Promise.all([getServiceProviderId(walletClientToSigner(walletClient)),getAccountBalance()])
                const info = serviceProviders.pop();
                if (!info) return;
                const { args } = info;
                
                setSPId(args.pID.toString());
                setCompanyName(args.name);
                setLocation(args.location);
                setAvailability(localStorage.getItem("availability"));
                setBalance(balance);
                
            }
        })()

    }, [isConnected, walletClient]);


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