import { ethers } from "ethers";
import { abi as XPrintABI } from "../constant/abi";
import { formatEther, loadIPFSData } from "../utils";
import { cusdAddress, web_rpc, xprintAddress } from "../constant/env";
import { erc20ABI } from "wagmi";


console.log(web_rpc);
export const getXPrintJobContract = () => {

    const contract = new ethers.Contract(
       xprintAddress,
        XPrintABI.abi,
        new ethers.providers.JsonRpcProvider(web_rpc));

    return contract
}

export const registerServiceProvider = async ({ signer }) => {
    const contract = getXPrintJobContract();


    const txn = await contract.connect(signer).registerServiceProvider(name, location, availability);

    await txn.wait();
}

export const getHash = (str) => {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
}

export const getServiceProviderId = async (signer) => {
    const contract = getXPrintJobContract();

    const filter = contract.filters.PrinterCreated();

    const printers = await contract.queryFilter(filter);
    console.log(printers);
    return printers;
}

export const registerPrintCost = async ({ signer, spId, bytes32, unitCost }) => {
    const contract = getXPrintJobContract();

    const txn = await contract.connect(signer).registerPrintCost(spId, bytes32, celoCost);

    console.log(await txn.wait());
}

export const registerPrinter = async ({ signer, printerHash, owner, cid }) => {
    const contract = getXPrintJobContract();

    console.log({printerHash, owner, cid});
    const txn = await contract.connect(signer).registerPrinter(printerHash, owner, cid);

    const result = await txn.wait();

    console.log(result);

    return result;
}

export const processJob = async ({ signer, jobId }) => {
    const contract = getXPrintJobContract();

    const txn = await contract.connect(signer).processJob(jobId);

    await txn.wait();
}

export const getBalance = async ({ signer }) => {

    // const balance = await contract.balances(signer._address);
    console.log(web_rpc);
    const contract = new ethers.Contract(
        cusdAddress,
        erc20ABI,
        new ethers.providers.JsonRpcProvider(web_rpc)
    );

    const balance = await contract.balanceOf(signer._address);

    console.log(balance);
    return balance


    return formatEther(0n);
}

export const getJobs = async (printerHash) => {
    const contract = getXPrintJobContract();

    const filter = contract.filters.JobIssued(null, null, printerHash, null);

    const jobs = await contract.queryFilter(filter);

    console.log(jobs);

    return;

    // const jobs = [];
    // const jobFileURI = [];
    // const tokenData = [];

    // jobIds.forEach(({ args }, idx) => jobs.push(getJob(args.jobID)));
    // jobIds.forEach(({ args }, idx) => jobFileURI.push(getJobFileURI(args.jobID)));

    // const jobsData = await Promise.all(jobs)
    // const jobsFileURIData = await Promise.all(jobFileURI);

    // jobsFileURIData.forEach((uri) => tokenData.push(loadIPFSData(`https://salmon-aggressive-rabbit-648.mypinata.cloud/ipfs/${uri.split("//")[1]}`)));

    // const nftData = await Promise.all(tokenData);

    // // console.log(nftData);
    // const jobsList = jobsData.reduce(
    //     (prev,
    //         { printCost, serviceCost, dueDate, donetimestamp, timestamp, provider, status },
    //         idx) => {
    //         const {name, attributes} = nftData[idx];
    //         const [file, , ,, color_scheme, paper_size, orientation] = attributes;
    //         return [{
    //             key:idx,
    //             name,
    //             print_cost: formatEther(printCost),
    //             serviceCost: formatEther(serviceCost),
    //             color_scheme: color_scheme?.value,
    //             paper_size: paper_size?.value,
    //             service_name: `${color_scheme?.value}|${orientation?.value}|${paper_size?.value}`,
    //             orientation: orientation?.value,
    //             dueDate: dueDate.toString(),
    //             timestamp: timestamp.toString(),
    //             donetimestamp: donetimestamp.toString(),
    //             provider,
    //             status: JOBSTATUS[status],
    //             file: `https://salmon-aggressive-rabbit-648.mypinata.cloud/ipfs/${file?.value.split("//")[1]}`
    //         },...prev]
    //     }, []);

    // console.log(jobsList);

    // return jobsList;
}

export const getOnChainPrinters = async (owner) => {
    const contract = getXPrintJobContract();

    const filter = contract.filters.PrinterCreated(owner, null, null);

    const printers = await contract.queryFilter(filter);

    console.log(printers);

    return printers;
}

export const getJob = async (jobId) => {
    const contract = getXPrintJobContract();

    const data = await contract.jobs(jobId);

    return data;
}

export const getJobFileURI = async (jobId) => {
    const contract = getXPrintJobContract();

    const uri = await contract.tokenURI(jobId);

    return uri;

}

export const withdrawCost = async ({ signer }) => {
    const contract = getXPrintJobContract();

    const txn = await contract.connect(signer).withdrawCost();

    await txn.wait();
}

export const completeJob = async ({ signer, jobId }) => {
    const contract = getXPrintJobContract();

    const txn = await contract.connect(signer).completeJob(jobId);

    await txn.wait();
}