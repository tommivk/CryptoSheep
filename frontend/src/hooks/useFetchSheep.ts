import { useCallback, useEffect, useState } from "react";
import { BlockData, Sheep } from "../types";
import { Contract } from "web3-eth-contract";

type Props = {
  contract: Contract;
  blockData: BlockData;
  id: string | undefined;
};

const useFetchSheep = ({ id, contract, blockData }: Props) => {
  const [sheepData, setSheepData] = useState<Sheep>();
  const [error, setError] = useState(false);

  const getSheepData = useCallback(
    async (id: string) => {
      try {
        const sheep = await contract?.methods.getSheep(id).call();
        setSheepData(sheep);
        setError(false);
      } catch (error) {
        setError(true);
        setSheepData(undefined);
      }
    },
    [id]
  );

  useEffect(() => {
    if (id) {
      getSheepData(id);
    }
  }, [getSheepData, id, blockData.blockNumber]);

  return [sheepData, error] as const;
};

export default useFetchSheep;
