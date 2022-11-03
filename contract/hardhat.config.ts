import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        interval: 10000,
      },
    },
    goerli: {
      url: ALCHEMY_API_URL,
      accounts: [GOERLI_PRIVATE_KEY!],
      gasPrice: 4000000000,
    },
  },
};

export default config;
