import React, { useCallback, useEffect, useState } from "react";
import { AbiItem } from "web3-utils";

import Web3 from "web3";

import contractAbi from "./ContractAbi.json";
import Button from "./components/Button";
import SheepList from "./components/SheepList";
import { BlockData } from "./types";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const sheepCost = 200;

const App = () => {
  const [account, setAccount] = useState<string>();
  const [sheepName, setSheepName] = useState("");
  const [blockData, setBlockData] = useState<BlockData>();

  const web3 = new Web3(Web3.givenProvider);

  const contract = new web3.eth.Contract(
    contractAbi.abi as AbiItem[],
    contractAddress
  );

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      window.ethereum.request?.({ method: "eth_requestAccounts" });
      const [account] = await web3.eth.getAccounts();
      setAccount(account);
    } else {
      console.error("No compatible wallet found");
    }
  }, []);

  const getBlockTime = useCallback(async () => {
    const blockNumber = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(blockNumber);
    setBlockData({
      blockNumber,
      blockTime: Number(block.timestamp),
    });
  }, []);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  const mintSheep = async () => {
    if (!account) {
      return connectWallet();
    }
    if (!sheepName) return console.error("Name is required");
    try {
      await contract.methods
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
