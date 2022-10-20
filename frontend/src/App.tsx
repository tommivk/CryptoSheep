import { useCallback, useEffect, useState } from "react";
import { AbiItem } from "web3-utils";

import Web3 from "web3";

import contractAbi from "./ContractAbi.json";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const App = () => {
  const [account, setAccount] = useState<string>();

  const web3 = new Web3(Web3.givenProvider);

  const contract = new web3.eth.Contract(
    contractAbi.abi as AbiItem[],
    contractAddress
  );

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      window.ethereum.request?.({ method: "eth_requestAccounts" });
      const [account] = await web3.eth.getAccounts();
      setAccount(account);
    } else {
      console.error("No compatible wallet found");
    }
  }, []);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <div>
      {account ? (
        <div>Connected address: {account}</div>
      ) : (
        <button onClick={connectWallet}>Connect wallet</button>
      )}
    </div>
  );
};

export default App;
