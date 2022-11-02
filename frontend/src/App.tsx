import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SheepList from "./components/SheepList";
import SheepPage from "./components/SheepPage";
import Navigation from "./components/Navigation";
import useBlockData from "./hooks/useBlockData";
import useWallet from "./hooks/useWallet";
import useWeb3 from "./hooks/useWeb3";
import { NotificationMessage, Sheep } from "./types";
import { EventData } from "web3-eth-contract";
import Mint from "./components/Mint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import Notification from "./components/Notification";
import SheepSearch from "./components/SheepSearch";

const App = () => {
  const [ownedSheeps, setOwnedSheeps] = useState<Array<Sheep>>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [notification, setNotification] = useState<
    NotificationMessage | undefined
  >();

  const [web3, contract, contractState] = useWeb3();
  const [blockData] = useBlockData(web3);
  const [account, balance, connectWallet] = useWallet({ web3, blockData });

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
    document.body.classList.toggle("dark", !darkMode);
    setDarkMode((prev) => !prev);
  };

  const notificationRef = useRef<NodeJS.Timeout | null>(null);

  const handleNotification = ({ message, type }: NotificationMessage) => {
    if (notificationRef.current) {
      clearTimeout(notificationRef.current);
    }
    const timeout = setTimeout(() => {
      setNotification(undefined);
    }, 7000);

    notificationRef.current = timeout;
    setNotification({ message: message, type });
  };

  if (!blockData || !web3 || !contract || !contractState)
    return <div>Loading</div>;

  return (
    <div className="min-h-[100vh] bg-lightBackground dark:bg-darkBackground dark:text-slate-200">
      <FontAwesomeIcon
        onClick={toggleDarkMode}
        icon={darkMode ? faSun : faMoon}
        className="fixed bottom-8 left-8 h-6 text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-slate-200 cursor-pointer z-20"
      />

      <Navigation
        account={account}
        balance={balance}
        connectWallet={connectWallet}
        handleNotification={handleNotification}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Mint
              account={account}
              contract={contract}
              contractState={contractState}
              connectWallet={connectWallet}
              handleNotification={handleNotification}
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
              handleNotification={handleNotification}
            />
          }
        />
        <Route
          path="/sheep"
          element={<SheepList sheeps={ownedSheeps} account={account} />}
        />
        <Route
          path="/search"
          element={
            <SheepSearch
              account={account}
              contract={contract}
              blockData={blockData}
            />
          }
        />
        <Route path="*" element={<div>404</div>} />
      </Routes>

      {notification && (
        <Notification
          notification={notification}
          setNotification={setNotification}
        />
      )}
    </div>
  );
};

export default App;
