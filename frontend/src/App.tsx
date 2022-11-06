import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SheepList from "./components/SheepList";
import SheepPage from "./components/SheepPage";
import Navigation from "./components/Navigation";
import useBlockData from "./hooks/useBlockData";
import useBalance from "./hooks/useBalance";
import useWeb3 from "./hooks/useWeb3";
import useContract from "./hooks/useContract";
import useAccount from "./hooks/useAccount";
import { NotificationMessage, Sheep } from "./types";
import { EventData } from "web3-eth-contract";
import Mint from "./components/Mint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";
import Notification from "./components/Notification";
import SheepSearch from "./components/SheepSearch";
import ErrorPage from "./components/ErrorPage";
import Loading from "./components/Loading";

const App = () => {
  const [ownedSheeps, setOwnedSheeps] = useState<Array<Sheep>>();
  const [sheepFetchError, setSheepFetchError] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notification, setNotification] = useState<
    NotificationMessage | undefined
  >();

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

  const [web3, wrongNetworkError, connectWallet, web3Error] = useWeb3({
    handleNotification,
  });
  const [account, accountError] = useAccount({ web3 });
  const [contract, contractState, contractError] = useContract({ web3 });
  const [blockData, blockDataError] = useBlockData(web3);
  const [balance] = useBalance({ account, web3, blockData });

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
    if (!contract) return;
    if (!account) {
      return setOwnedSheeps(undefined);
    }
    try {
      const sheepIds = await contract.methods
        .getOwnedSheeps()
        .call({ from: account });

      const result =
        ((await Promise.all(
          sheepIds.map((id: string) => {
            return contract.methods.getSheep(id).call();
          })
        )) as Array<Sheep>) ?? [];

      setOwnedSheeps(result);
      setSheepFetchError(false);
    } catch (error) {
      console.error(error);
      setSheepFetchError(true);
    }
  }, [account, contract]);

  useEffect(() => {
    getSheeps();
  }, [getSheeps, account, contract, blockData?.blockNumber]);

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark", !darkMode);
    setDarkMode((prev) => !prev);
  };

  const error =
    sheepFetchError ||
    web3Error ||
    accountError ||
    blockDataError ||
    contractError;

  if (error) {
    return (
      <div className="min-h-[100vh] bg-lightBackground dark:bg-darkBackground dark:text-slate-200">
        <Navigation
          account={account}
          balance={balance}
          connectWallet={connectWallet}
          handleNotification={handleNotification}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <ErrorPage code={500} text="Internal server error" />
      </div>
    );
  }

  if (!blockData || !contract || !contractState)
    return (
      <div className="min-h-[100vh] bg-lightBackground dark:bg-darkBackground dark:text-slate-200">
        <Navigation
          account={account}
          balance={balance}
          connectWallet={connectWallet}
          handleNotification={handleNotification}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <Loading />
      </div>
    );

  return (
    <div className="min-h-[100vh] bg-lightBackground dark:bg-darkBackground dark:text-slate-200">
      {wrongNetworkError && (
        <div className="absolute w-full h-[100vh] bg-red-200 z-[1000] bg-[#000000a1] flex justify-center items-center">
          <p className="text-2xl">Please switch to Goerli network</p>
        </div>
      )}

      <FontAwesomeIcon
        onClick={toggleDarkMode}
        icon={darkMode ? faSun : faMoon}
        className="hidden lg:block fixed bottom-8 left-8 h-6 text-gray-600 hover:text-gray-400 dark:text-gray-400 dark:hover:text-slate-200 cursor-pointer z-20"
      />

      <Navigation
        account={account}
        balance={balance}
        connectWallet={connectWallet}
        handleNotification={handleNotification}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
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
        <Route path="*" element={<ErrorPage code={404} text="Not found" />} />
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
