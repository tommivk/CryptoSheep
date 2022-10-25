import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { BlockData } from "../types";

const useBlockData = (web3: Web3 | undefined) => {
  const [blockData, setBlockData] = useState<BlockData>();

  const getBlockData = useCallback(async () => {
    const blockNumber = await web3!.eth.getBlockNumber();
    const block = await web3!.eth.getBlock(blockNumber);
    setBlockData({
      blockNumber,
      blockTime: Number(block.timestamp),
    });
  }, [web3]);

  useEffect(() => {
    if (!web3) return;
    getBlockData();

    const subscription = web3.eth.subscribe("newBlockHeaders");
    subscription.on("data", (data) => {
      setBlockData({
        blockNumber: data.number,
        blockTime: Number(data.timestamp),
      });
    });

    return () => {
      subscription.unsubscribe(() => console.log("Unsubscribed"));
    };
  }, [web3, getBlockData]);

  return [blockData] as const;
};

export default useBlockData;
