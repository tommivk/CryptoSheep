import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { NotificationMessage } from "../types";

const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;
const GOERLI_NETWORK_ID = 5;

type Props = {
  handleNotification: ({ message, type }: NotificationMessage) => void;
};

const useWeb3 = ({ handleNotification }: Props) => {
  const [web3, setWeb3] = useState<Web3>();
  const [wrongNetworkError, setWrongNetworkError] = useState<boolean>(false);

  const isCorrectNetwork = async (web3: Web3) => {
    const networkId = await web3.eth.net.getId();
    if (networkId !== GOERLI_NETWORK_ID) {
      return false;
    }
    return true;
  };

  const promptChainChange = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x5` }],
    });
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(Web3.givenProvider);

        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3);

        const correctNetwork = await isCorrectNetwork(web3);
        if (!correctNetwork) {
          setWrongNetworkError(true);
          await promptChainChange();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      handleNotification({
        message: "No Ethereum compatible wallet found",
        type: "error",
      });
      console.error("No compatible wallet found");
    }
  };

  const initialize = useCallback(async () => {
    try {
      // Check if there is an account connected
      const accounts = await window?.ethereum?.request?.({
        method: "eth_accounts",
      });

      let provider = Web3.givenProvider;

      if (!accounts || accounts.length === 0) {
        provider = new Web3.providers.HttpProvider(INFURA_API_KEY);
      }

      const web3 = new Web3(provider);
      const correctNetwork = await isCorrectNetwork(web3);
      if (!correctNetwork) {
        setWrongNetworkError(true);
        return await promptChainChange();
      }

      setWrongNetworkError(false);
      setWeb3(web3);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const checkDisconnect = async (accounts: Array<String>) => {
    if (!accounts || accounts.length === 0) {
      try {
        setWeb3(new Web3(new Web3.providers.HttpProvider(INFURA_API_KEY)));
        setWrongNetworkError(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    initialize();

    window?.ethereum?.on("accountsChanged", checkDisconnect);
    window?.ethereum?.on("chainChanged", initialize);

    return () => {
      window?.ethereum?.removeListener("accountsChanged", checkDisconnect);
      window?.ethereum?.removeListener("chainChanged", initialize);
    };
  }, [initialize]);

  return [web3, wrongNetworkError, connectWallet] as const;
};

export default useWeb3;
