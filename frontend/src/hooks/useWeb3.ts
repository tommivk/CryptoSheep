import { useEffect, useState } from "react";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";
import Web3 from "web3";
import contractAbi from "../ContractAbi.json";

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider ?? "ws://localhost:8545");
    setWeb3(web3);

    const contract = new web3.eth.Contract(
      contractAbi.abi as AbiItem[],
      contractAddress
    );
    setContract(contract);
  }, []);

  return [web3, contract] as const;
};

export default useWeb3;
