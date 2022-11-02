import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { BlockData } from "../types";

type Props = {
  web3: Web3 | undefined;
  blockData: BlockData | undefined;
};

const useWallet = ({ web3, blockData }: Props) => {
  const [account, setAccount] = useState<string>();
  const [balance, setBalance] = useState<string>();

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

  const updateBalance = useCallback(async () => {
    if (!web3 || !account) return;
    try {
      const balanceWei = await web3.eth.getBalance(account);
      const balanceETH = web3.utils.fromWei(balanceWei);
      setBalance(balanceETH);
    } catch (error) {
      setBalance(undefined);
      console.error(error);
    }
  }, [web3, account]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance, blockData?.blockNumber, account]);

  const loadAccount = useCallback(async () => {
    if (!web3) return;
    const [account] = await web3.eth.getAccounts();
    if (account) {
      setAccount(account);
    }
  }, [web3]);

  useEffect(() => {
    loadAccount();
  }, [loadAccount, web3]);

  return [account, balance, connectWallet] as const;
};

export default useWallet;
