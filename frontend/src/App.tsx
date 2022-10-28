import React, { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Button from "./components/Button";
import SheepList from "./components/SheepList";
import SheepPage from "./components/SheepPage";
import Navigation from "./components/Navigation";
import useBlockData from "./hooks/useBlockData";
import useWallet from "./hooks/useWallet";
import useWeb3 from "./hooks/useWeb3";
import { Sheep } from "./types";
import { EventData } from "web3-eth-contract";

const sheepCost = 200;

const App = () => {
  const [sheepName, setSheepName] = useState("");
  const [ownedSheeps, setOwnedSheeps] = useState<Array<Sheep>>([]);

  const [web3, contract, contractState] = useWeb3();
  const [account, connectWallet] = useWallet(web3);
  const [blockData] = useBlockData(web3);

  const navigate = useNavigate();

  useEffect(() => {
    if (!account || !contract) return;
    contract.events.NewSheep(
      { filter: { _owner: account } },
      (error: Error, event: EventData) => {
        if (error) {
          return console.error(error);
        }
        const sheepId = event.returnValues._sheepId;
        navigate(`/sheep/${sheepId}`);
      }
    );
  }, [account, contract]);

  const getSheeps = useCallback(async () => {
    if (!contract || !account) return;
    const result = await contract.methods
      .getOwnedSheeps()
      .call({ from: account });
    setOwnedSheeps(result);
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

  if (!blockData || !web3 || !contract || !contractState)
    return <div>Loading</div>;

  return (
    <div>
      <Navigation account={account} connectWallet={connectWallet} />
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
            <SheepPage
              account={account}
              contract={contract}
              blockData={blockData}
              contractState={contractState}
            />
          }
        />
        <Route
          path="/sheep"
          element={<SheepList sheeps={ownedSheeps} account={account} />}
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
};

export default App;
