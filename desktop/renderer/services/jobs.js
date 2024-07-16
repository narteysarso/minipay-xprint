import { ethers } from "ethers";
import { getXPrintJobContract } from "./xprintjob";

// const colors =["monochrom", "color"];
// const papers = ["A2", "A3", "A4", "A5"];
// const orientations = ["portrait", "landscape"];
// const status = ["queued", "done", "processing", "failed"]

// export const fakerJobData = (count = 10) => {
//     const data = new Array(count).fill(0).map((v, idx) => ({
//         key: idx,
//         name: ethers.Wallet.createRandom().address,
//         paper_size: papers[Math.floor(Math.random() * papers.length)],
//         color_scheme: colors[Math.floor(Math.random() * colors.length)],
//         number_of_pages: Math.floor(Math.random() * 100),
//         service_name: `some name ${idx}`,
//         print_cost: (Math.random() * 5).toFixed(4),
//         status: status[Math.floor(Math.random() * status.length)],
//         orientation: orientations[Math.floor(Math.random() * orientations.length)],
//     }));

//     return data
// }

// const EVENT_NUM = {
//     CHANGE_JOB_STATE: jobStateSubscribers,
//     JOBISSUED: jobIssuedSubscribers,
//     RECEIVEDJOB: jobRecievedSubscribers
// }

const contract = getXPrintJobContract();

export const addJobIssuedListener = (printerHash, fn) => {
    const filter = contract.filters.JobIssued(null, null, printerHash, null);

    contract.on(filter, fn)
}

export const removeIssuedListener = (printerHash, fn) => {
    const filter = contract.filters.JobIssued(null, null, printerHash, null);
    contract.off(filter, fn)
}
