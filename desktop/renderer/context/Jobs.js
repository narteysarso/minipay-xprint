import { createContext, useEffect, useState } from "react";
import { getBalance, getJob, getJobFileURI, getJobs, getOnChainPrinters, withdrawCost } from "../services/xprintjob";
import { useAccount, useWalletClient } from "wagmi";
import { walletClientToSigner } from "../utils";
import { addJobIssuedListener, removeIssuedListener } from "../services/jobs";

export const JobsContext = createContext({})

export default function JobsProvider({ children }) {
    const [jobs, setJobs] = useState([]);
    const [balance, setBalance] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [loadingJobs, setLoadingJobs] = useState(false);
    const [errorMsg, setError] = useState(undefined);
    const walletClient = useWalletClient();
    const { isConnected } = useAccount();

    const getAccountBalance = async () => await getBalance({ signer: walletClientToSigner(walletClient) });

    const withdrawPrintCost = async () => await withdrawCost({ signer: walletClientToSigner(walletClient) });

    useEffect(() => {
        if (!isConnected || !walletClient?.account) return;

        // const printers = getOnChainPrinters(walletClient?.account);

        const fn = async (owner, printer, jobid) => {
            console.log(owner, printer, jobid);
            const [jobData, tokenUri] = await Promise([getJob(jobid) ,getJobFileURI(jobid)]);

            console.log(jobData, tokenUri);
        }

        addJobIssuedListener(walletClientToSigner(walletClient)._address, fn)

        return () => {
            removeIssuedListener(walletClientToSigner(walletClient)._address, fn);
        }
       
    },[isConnected, walletClient]);

    useEffect(()=>{
        //TODO: print here
    },[jobs]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (isConnected && walletClient?.account) {
                    const [balance, jobs] = await Promise.all([getAccountBalance(), getJobs(walletClientToSigner(walletClient)._address)]);
                    setBalance(balance);
                    setJobs(jobs)
                }
            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false);
            }
            
        })()

    }, [isConnected, walletClient]);


    return (
        <JobsContext.Provider value={{
            balance,
            loading,
            jobs,
            getAccountBalance,
            withdrawPrintCost
        }}>
            {children}
        </JobsContext.Provider>
    )
}