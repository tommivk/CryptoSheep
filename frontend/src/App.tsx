import React, { useEffect, useState } from "react";
import Button from "./components/Button";
import SheepList from "./components/SheepList";
import useBlockData from "./hooks/useBlockData";
import useWallet from "./hooks/useWallet";
import useWeb3 from "./hooks/useWeb3";

const sheepCost = 200;

const App = () => {
  const [sheepName, setSheepName] = useState("");

  const [web3, contract] = useWeb3();
  const [account, connectWallet] = useWallet(web3);
  const [blockData] = useBlockData(web3);

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

  if (!blockData || !web3 || !contract) return <div>Loading</div>;

  return (
    <div>
      {account ? (
        <div>Connected address: {account}</div>
      ) : (
        <Button onClick={connectWallet}>Connect wallet</Button>
      )}
      <input type="text" value={sheepName} onChange={handleNameChange}></input>
      <Button onClick={mintSheep}>Mint</Button>
      <SheepList account={account} contract={contract} blockData={blockData} />
    </div>
  );
};

export default App;
