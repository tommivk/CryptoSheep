import { useState } from "react";
import { Contract } from "web3-eth-contract";
import { GithubPicker } from "react-color";
import { ContractState } from "../types";
import Button from "./Button";
import GogglySheep from "./GogglySheep";

type Props = {
  account: string | undefined;
  connectWallet: () => Promise<void>;
  contract: Contract;
  contractState: ContractState;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewSheepModal = ({
  account,
  connectWallet,
  contract,
  contractState,
  setModalOpen,
}: Props) => {
  const [sheepName, setSheepName] = useState("");
  const [sheepColor, setSheepColor] = useState<string>(
    contractState.sheepColors[0]
  );
  const { sheepCost } = contractState;

  const mintSheep = async () => {
    if (!account) return connectWallet();
    if (!sheepName) return console.error("Name is required");

    try {
      await contract?.methods
        .buySheep(sheepName, sheepColor)
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
    <div className="h-[100vh] w-[100vw] bg-[#0000009a] flex items-center justify-center absolute top-0 z-50">
      <div className="min-h-fit min-w-fit max-w-[90vw] bg-darkMain rounded-md px-2 py-10 md:p-10 relative">
        <div
          className="flex justify-center items-center cursor-pointer absolute top-1 right-1 p-4 bg-darkSecondary rounded-full w-10 h-10 hover:bg-[#3d3e42]"
          onClick={() => setModalOpen(false)}
        >
          <span className="font-semibold text-slate-300 text-sm">X</span>
        </div>

        <GogglySheep sheepColor={sheepColor} />

        <p className="text-center mb-2 mt-5">Sheep color</p>
        <GithubPicker
          width="166px"
          styles={{
            default: { card: { backgroundColor: "transparent" } },
          }}
          className="block m-auto mb-5"
          colors={contractState.sheepColors}
          triangle="hide"
          onChange={(color) => setSheepColor(color.hex)}
        />

        <p className="text-center mb-2">Sheep name</p>
        <input
          placeholder="Sheep name"
          type="text"
          value={sheepName}
          onChange={handleNameChange}
          className="mb-5 p-2 rounded-lg mr-2 text-slate-800 border-2 border-slate-600 m-auto block"
        ></input>

        <Button onClick={mintSheep} className="block m-auto mt-10">
          Mint
        </Button>
      </div>
    </div>
  );
};

export default NewSheepModal;
