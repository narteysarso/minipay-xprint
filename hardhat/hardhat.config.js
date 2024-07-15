require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path: ".env.local"});

/** @type import('hardhat/config').HardhatUserConfig */
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.20",
  networks: {
    alfajores: {
      url: `https://alfajores-forno.celo-testnet.org`,
      accounts: [process.env.ALFAJORES_PRIVATE_KEY],
    },
    celo: {
      url: `https://forno.celo.org`,
      accounts: [process.env.CELO_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey:{
      alfajores: process.env.CELO_SCAN_API_KEY,
      celo: process.env.CELO_SCAN_API_KEY,
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io/"
        }
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/"
        }
      }
    ]
  },
};
