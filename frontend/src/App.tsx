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
import Mint from "./components/Mint";

const App = () => {
  const [ownedSheeps, setOwnedSheeps] = useState<Array<Sheep>>([]);
  const [darkMode, setDarkMode] = useState(true);

  const [web3, contract, contractState] = useWeb3();
  const [account, connectWallet] = useWallet(web3);
  const [blockData] = useBlockData(web3);

  const navigate = useNavigate();

  useEffect(() => {
    if (!account || !contract) return;
    const subscription = contract.events.NewSheep(
      {
        filter: { _owner: account },
      },
      (error: Error, event: EventData) => {
        if (error) {
          return console.error(error);
        }
        const sheepId = event.returnValues._sheepId;
        navigate(`/sheep/${sheepId}`);
      }
    );
    return () => subscription.unsubscribe();
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

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark", darkMode);
    setDarkMode((prev) => !prev);
  };

  if (!blockData || !web3 || !contract || !contractState)
    return <div>Loading</div>;

  return (
    <div className="min-h-[100vh] dark:bg-darkBackground dark:text-slate-200">
      <button onClick={toggleDarkMode} className="absolute bottom-2 left-2">
        Toggle darkmode
      </button>
      <Navigation account={account} connectWallet={connectWallet} />
      <Routes>
        <Route
          path="/"
          element={
            <Mint
              account={account}
              contract={contract}
              contractState={contractState}
              connectWallet={connectWallet}
            />
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
