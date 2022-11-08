import { useCallback, useEffect, useState } from "react";
import { NotificationMessage } from "../types";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import Web3 from "web3";
import contractAbi from "../ContractAbi.json";

const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const GOERLI_NETWORK_ID = 5;

type Props = {
  handleNotification: ({ message, type }: NotificationMessage) => void;
};

const useWeb3 = ({ handleNotification }: Props) => {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract>();
  const [error, setError] = useState(false);
  const [wrongNetworkError, setWrongNetworkError] = useState<boolean>(false);

  const isCorrectNetwork = async (web3: Web3) => {
    const networkId = await web3.eth.net.getId();
    if (networkId !== GOERLI_NETWORK_ID) {
      return false;
    }
    return true;
  };

  const promptChainChange = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x5` }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(Web3.givenProvider);

        await window.ethereum.request({ method: "eth_requestAccounts" });
        setWeb3(web3);
        await updateContract(web3);
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

  const updateContract = async (web3: Web3) => {
    try {
      const correctNetwork = await isCorrectNetwork(web3);
      if (correctNetwork) {
        const contract = new web3.eth.Contract(
          contractAbi.abi as AbiItem[],
          CONTRACT_ADDRESS
        );
        setContract(contract);
        setWrongNetworkError(false);
      } else {
        promptChainChange();
        setWrongNetworkError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectGivenProvider = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      await updateContract(web3);
      setWeb3(web3);
    } catch (error) {
      console.error(error);
    }
  };

  const connectedAccounts = async () => {
    return (
      (await window?.ethereum?.request?.({
        method: "eth_accounts",
      })) ?? []
    );
  };

  const initialize = useCallback(async () => {
    try {
      const accounts = await connectedAccounts();

      // Use Infura as the default provider
      const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_API_KEY));
      setWeb3(web3);
      await updateContract(web3);

      // Use wallet as a provider if there is an account connected
      if (accounts.length > 0) {
        await connectGivenProvider();
      }
    } catch (error) {
      setError(true);
      console.error(error);
    }
  }, []);

  const checkDisconnect = async (accounts: Array<String>) => {
    if (!accounts || accounts.length === 0) {
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_API_KEY));
        setWeb3(web3);
        await updateContract(web3);
        setWrongNetworkError(false);
      } catch (error) {
        setError(true);
        console.error(error);
      }
    }
  };

  const handleChainChange = async (chainId: string) => {
    const accounts = await connectedAccounts();
    if (accounts.length === 0) return;
    if (Number(chainId) !== GOERLI_NETWORK_ID) {
      promptChainChange();
      setWrongNetworkError(true);
      return;
    }
    connectGivenProvider();
  };

  useEffect(() => {
    initialize();

    window?.ethereum?.on("accountsChanged", checkDisconnect);
    window?.ethereum?.on("chainChanged", handleChainChange);

    return () => {
      window?.ethereum?.removeListener("accountsChanged", checkDisconnect);
      window?.ethereum?.removeListener("chainChanged", handleChainChange);
    };
  }, [initialize]);

  return [web3, contract, connectWallet, wrongNetworkError, error] as const;
};

export default useWeb3;
