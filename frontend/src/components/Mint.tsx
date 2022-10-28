import { useState } from "react";
import { Contract } from "web3-eth-contract";
import { ContractState } from "../types";
import Button from "./Button";

type Props = {
  account: string | undefined;
  connectWallet: () => Promise<void>;
  contract: Contract;
  contractState: ContractState;
};

const Mint = ({ account, connectWallet, contract, contractState }: Props) => {
  const [sheepName, setSheepName] = useState("");

  const { sheepCost } = contractState;

  const mintSheep = async () => {
    if (!account) return connectWallet();
    if (!sheepName) return console.error("Name is required");

    try {
      await contract?.methods
        .buySheep(sheepName)
        .send({ from: account, value: sheepCost });
      setSheepName("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSheepName(event.target.value);
  };

  return (
    <div className="flex justify-center items-center mt-[30%]">
      <div className="">
        <input
          placeholder="Sheep name"
          type="text"
          value={sheepName}
          onChange={handleNameChange}
          className="p-2 rounded-lg mr-2 text-slate-800 border-2 border-slate-600"
        ></input>
        <Button onClick={mintSheep}>Mint</Button>
      </div>
    </div>
  );
};

export default Mint;
