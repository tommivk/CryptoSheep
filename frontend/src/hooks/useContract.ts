import { useEffect, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import contractAbi from "../ContractAbi.json";
import { ContractState } from "../types";
import { AbiItem } from "web3-utils";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

type Props = {
  web3: Web3 | undefined;
};

const useContract = ({ web3 }: Props) => {
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
    if (web3) {
      const contract = new web3.eth.Contract(
        contractAbi.abi as AbiItem[],
        CONTRACT_ADDRESS
      );
      setContract(contract);
      getContractState(contract);
    }
  }, [web3]);

  return [contract, contractState] as const;
};

export default useContract;
