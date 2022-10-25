import React, { useCallback, useEffect, useState } from "react";
import Button from "./components/Button";
import SheepList from "./components/SheepList";
import useWeb3 from "./hooks/useWeb3";

import { BlockData } from "./types";

const sheepCost = 200;

const App = () => {
  const [account, setAccount] = useState<string>();
  const [sheepName, setSheepName] = useState("");
  const [blockData, setBlockData] = useState<BlockData>();

  const web3 = new Web3(Web3.givenProvider);

  const [web3, contract] = useWeb3();

  const getBlockTime = useCallback(async () => {
    if (!web3) return;
    const blockNumber = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNumber);
    setBlockData({
      blockNumber,
      blockTime: Number(block.timestamp),
    });
  }, [web3]);

  useEffect(() => {
    if (web3) {
      getBlockTime();
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
    }
  }, [web3, getBlockTime]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  const mintSheep = async () => {
    if (!account) {
      return connectWallet();
    }
    if (!sheepName) return console.error("Name is required");
    try {
      await contract?.methods
        .buySheep(sheepName)
        .send({ from: account, value: sheepCost });
      setSheepName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSheepName(event.target.value);
  };

  if (!blockData) return <div>Loading</div>;

  return (
    <div>
      {account ? (
        <div>Connected address: {account}</div>
      ) : (
        <Button onClick={connectWallet}>Connect wallet</Button>
      )}
      <input type="text" value={sheepName} onChange={handleNameChange}></input>
      <Button onClick={mintSheep}>Mint</Button>
      <SheepList account={account} contract={contract} />
    </div>
  );
};

export default App;
