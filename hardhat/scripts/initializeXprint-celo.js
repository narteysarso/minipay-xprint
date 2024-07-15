const addresses = require("../ignition/deployments/chain-42220/deployed_addresses.json");
const xprintArtifacts = require("../ignition/deployments/chain-42220/artifacts/XprintCelo#XPrint.json");
const hre = require("hardhat");


async function main() {
  const cusdAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";
  const accounts = await hre.ethers.getSigners();
  const xprint = await hre.ethers.getContractAt(xprintArtifacts.abi, addresses["XprintCelo#XPrint"], accounts[0]);
  await xprint.setPaymentToken(cusdAddress);
  await xprint.setRedeemToken(cusdAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});