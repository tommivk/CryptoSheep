import { useCallback, useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";
import { ContractState } from "../types";

type Props = {
  contract: Contract | undefined;
};

const useContractState = ({ contract }: Props) => {
  const [contractState, setContractState] = useState<ContractState>();
  const [error, setError] = useState(false);

  const getContractState = useCallback(async () => {
    if (!contract) return;
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
      setError(true);
      console.error(error);
    }
  }, [contract]);

  useEffect(() => {
    getContractState();
  }, [contract]);

  return [contractState, error] as const;
};

export default useContractState;
