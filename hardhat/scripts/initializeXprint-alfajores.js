const addresses = require("../ignition/deployments/chain-44787/deployed_addresses.json");
const xprintArtifacts = require("../ignition/deployments/chain-44787/artifacts/XprintModule#XPrint.json");
const hre = require("hardhat");


async function main() {
    const accounts = await hre.ethers.getSigners();
    const xprint = await hre.ethers.getContractAt(xprintArtifacts.abi,addresses["Xprint#XPrint"], accounts[0]);
    await xprint.setPaymentToken(addresses["TTKModule#TTK"]);
    await xprint.setRedeemToken(addresses["TTKModule#TTK"]);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });