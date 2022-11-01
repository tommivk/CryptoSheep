import { useEffect, useState } from "react";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import contractAbi from "../ContractAbi.json";
import { ContractState } from "../types";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract>();
  const [contractState, setContractState] = useState<ContractState>();

  const getContractState = async (contract: Contract) => {
    try {
      const sheepCost = await contract.methods.sheepCost().call();
      const feedingDeadline = await contract.methods.feedingDeadline().call();
      const feedingLockDuration = await contract.methods.feedingUnlock().call();
      const sheepColors = await contract.methods.getSheepColors().call();

      setContractState({
        sheepCost: Number(sheepCost),
        sheepColors,
        feedingDeadline: Number(feedingDeadline),
        feedingLockDuration: Number(feedingLockDuration),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider ?? "ws://localhost:8545");
    setWeb3(web3);

    const contract = new web3.eth.Contract(
      contractAbi.abi as AbiItem[],
      contractAddress
    );
    getContractState(contract);
    setContract(contract);
  }, []);

  return [web3, contract, contractState] as const;
};

export default useWeb3;
