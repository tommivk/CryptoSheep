import { useEffect, useState } from "react";
import Web3 from "web3";

const useWallet = (web3: Web3 | undefined) => {
  const [account, setAccount] = useState<string>();

  const connectWallet = async () => {
    if (!web3) return;
    if (window.ethereum) {
      await window.ethereum.request?.({ method: "eth_requestAccounts" });
      const [account] = await web3.eth.getAccounts();
      setAccount(account);
    } else {
      console.error("No compatible wallet found");
    }
  };

  const loadAccount = async () => {
    if (!web3) return;
    const [account] = await web3.eth.getAccounts();
    if (account) {
      setAccount(account);
    }
  };

  useEffect(() => {
    loadAccount();
  }, [web3]);

  return [account, connectWallet] as const;
};

export default useWallet;
