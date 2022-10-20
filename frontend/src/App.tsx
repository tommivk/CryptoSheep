import { useCallback, useEffect, useState } from "react";

import Web3 from "web3";

const App = () => {
  const [account, setAccount] = useState<string>();

  const web3 = new Web3(Web3.givenProvider);

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
