import { ethers } from "hardhat";

async function main() {
  const sheepCost = 200;
  const Contract = await ethers.getContractFactory("SheepContract");
  const contract = await Contract.deploy(sheepCost);
  await contract.deployed();
  console.log("Contract deployed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
