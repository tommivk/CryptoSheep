import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useMatch } from "react-router-dom";
import Button from "./components/Button";
import SheepCard from "./components/SheepCard";
import SheepList from "./components/SheepList";
import useBlockData from "./hooks/useBlockData";
import useWallet from "./hooks/useWallet";
import useWeb3 from "./hooks/useWeb3";
import { Sheep } from "./types";

const sheepCost = 200;

const App = () => {
  const [sheepName, setSheepName] = useState("");
  const [sheeps, setSheeps] = useState<Array<Sheep>>([]);

  const [web3, contract] = useWeb3();
  const [account, connectWallet] = useWallet(web3);
  const [blockData] = useBlockData(web3);

  const getSheeps = useCallback(async () => {
    if (!contract || !account) return;
    const result = await contract.methods
      .getOwnedSheeps()
      .call({ from: account });
    setSheeps(result);
  }, [account, contract]);

  useEffect(() => {
    getSheeps();
  }, [getSheeps, account, contract, blockData?.blockNumber]);

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

  let sheepMatch;
  const match = useMatch("/sheep/:id");
  if (match) {
    sheepMatch = sheeps.find((sheep) => sheep.id === match.params.id);
  }

  if (!blockData || !web3 || !contract) return <div>Loading</div>;

  return (
    <div>
      <nav>
        <ul className="flex">
          <li>
            <Link to="/">Mint</Link>
          </li>
          <li>
            <Link to="/sheep">My sheeps</Link>
          </li>
          <li>
            {account ? (
              <div>Connected address: {account}</div>
            ) : (
              <Button onClick={connectWallet}>Connect wallet</Button>
            )}
          </li>
        </ul>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Mint</h1>
              <input
                type="text"
                value={sheepName}
                onChange={handleNameChange}
              ></input>

              <Button onClick={mintSheep}>Mint</Button>
            </div>
          }
        />
        <Route
          path="/sheep/:id"
          element={
            sheepMatch ? (
              <SheepCard
                sheep={sheepMatch}
                account={account}
                contract={contract}
                blockData={blockData}
              />
            ) : (
              <div>Sheep not found</div>
            )
          }
        />
        <Route
          path="/sheep"
          element={
            <SheepList
              sheeps={sheeps}
              account={account}
              contract={contract}
              blockData={blockData}
            />
          }
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
};

export default App;
