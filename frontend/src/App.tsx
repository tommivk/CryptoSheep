import { useCallback, useEffect, useState } from "react";
import { AbiItem } from "web3-utils";

import Web3 from "web3";

import contractAbi from "./ContractAbi.json";
import Button from "./components/Button";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const sheepCost = 200;

const App = () => {
  const [account, setAccount] = useState<string>();
  const [sheepName, setSheepName] = useState("");

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

  return (
    <div>
      {account ? (
        <div>Connected address: {account}</div>
      ) : (
        <Button onClick={connectWallet}>Connect wallet</Button>
      )}
      <input
        type="text"
        onChange={({ target }) => setSheepName(target.value)}
      ></input>
      <Button onClick={mintSheep}>Mint</Button>
    </div>
  );
};

export default App;
