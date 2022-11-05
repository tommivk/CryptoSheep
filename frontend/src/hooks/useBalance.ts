import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { BlockData } from "../types";

type Props = {
  web3: Web3 | undefined;
  blockData: BlockData | undefined;
  account: string | undefined;
};

const useBalance = ({ account, web3, blockData }: Props) => {
  const [balance, setBalance] = useState<string>();

  const updateBalance = useCallback(async () => {
    if (!web3 || !account) {
      return setBalance(undefined);
    }
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
  }, [updateBalance, blockData?.blockNumber, account, web3]);

  return [balance] as const;
};

export default useBalance;
