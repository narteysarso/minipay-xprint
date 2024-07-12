import { ethers } from "ethers";
import { abi as XPrintABI } from "../constant/abi";
import { formatEther, loadIPFSData } from "../utils";
import { JOBSTATUS } from "../constant/job";


export const getXPrintJobContract = () => {

    const contract = new ethers.Contract(
        XPrintABI.address,
        XPrintABI.abi,
        new ethers.providers.JsonRpcProvider("https://alfajores-forno.celo-testnet.org"));

    return contract
}

export const registerServiceProvider = async ({ name, location, availability, signer }) => {
    const contract = getXPrintJobContract();
    console.log(signer);

    const txn = await contract.connect(signer).registerServiceProvider(name, location, availability);

    await txn.wait();
}

export const getHash = (str) => {
    return ethers.utils.id(str);
}

export const getServiceProviderId = async (signer) => {
    const contract = getXPrintJobContract();

    const filter = contract.filters.NEWPROVIDER(null, signer._address);

    return await contract.queryFilter(filter);
}

export const registerPrintCost = async ({ signer, spId, bytes32, unitCost }) => {
    const contract = getXPrintJobContract();

    const celoCost = ethers.utils.parseEther(unitCost);

    console.log(spId, bytes32, celoCost)
    const txn = await contract.connect(signer).registerPrintCost(spId, bytes32, celoCost);

    console.log(await txn.wait());
}

export const processJob = async ({ signer, jobId }) => {
    const contract = getXPrintJobContract();

    const txn = await contract.connect(signer).processJob(jobId);

    await txn.wait();
}

export const getBalance = async ({ signer }) => {
    const contract = getXPrintJobContract();

    const balance = await contract.balances(signer._address);

    return formatEther(balance);
}

export const getJobs = async (address) => {
    const contract = getXPrintJobContract();

    const filter = contract.filters.JOBISSUED(null, address, null);

    const jobIds = await contract.queryFilter(filter);

    const jobs = [];
    const jobFileURI = [];
    const tokenData = [];

    jobIds.forEach(({ args }, idx) => jobs.push(getJob(args.jobID)));
    jobIds.forEach(({ args }, idx) => jobFileURI.push(getJobFileURI(args.jobID)));

    const jobsData = await Promise.all(jobs)
    const jobsFileURIData = await Promise.all(jobFileURI);

    jobsFileURIData.forEach((uri) => tokenData.push(loadIPFSData(`https://salmon-aggressive-rabbit-648.mypinata.cloud/ipfs/${uri.split("//")[1]}`)));

    const nftData = await Promise.all(tokenData);

    // console.log(nftData);
    const jobsList = jobsData.reduce(
        (prev,
            { printCost, serviceCost, dueDate, donetimestamp, timestamp, provider, status },
            idx) => {
            const {name, attributes} = nftData[idx];
            const [file, , ,, color_scheme, paper_size, orientation] = attributes;
            return [{
                key:idx,
                name,
                print_cost: formatEther(printCost),
                serviceCost: formatEther(serviceCost),
                color_scheme: color_scheme?.value,
                paper_size: paper_size?.value,
                service_name: `${color_scheme?.value}|${orientation?.value}|${paper_size?.value}`,
                orientation: orientation?.value,
                dueDate: dueDate.toString(),
                timestamp: timestamp.toString(),
                donetimestamp: donetimestamp.toString(),
                provider,
                status: JOBSTATUS[status],
                file: `https://salmon-aggressive-rabbit-648.mypinata.cloud/ipfs/${file?.value.split("//")[1]}`
            },...prev]
        }, []);

    console.log(jobsList);

    return jobsList;
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