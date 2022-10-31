import { useState } from "react";
import { Contract } from "web3-eth-contract";
import { GithubPicker } from "react-color";
import { ContractState, NotificationMessage } from "../types";
import Button from "./Button";
import GogglySheep from "./GogglySheep";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type Props = {
  account: string | undefined;
  connectWallet: () => Promise<void>;
  contract: Contract;
  contractState: ContractState;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleNotification: (params: NotificationMessage) => void;
};

const NewSheepModal = ({
  account,
  connectWallet,
  contract,
  contractState,
  setModalOpen,
  handleNotification,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [sheepName, setSheepName] = useState("");
  const [sheepColor, setSheepColor] = useState<string>(
    contractState.sheepColors[0]
  );
  const { sheepCost } = contractState;

  const mintSheep = async () => {
    if (!account) return connectWallet();
    if (!sheepName) return console.error("Name is required");

    setLoading(true);

    try {
      await contract?.methods
        .buySheep(sheepName, sheepColor)
        .send({ from: account, value: sheepCost });

      handleNotification({
        message: `New sheep "${sheepName}" successfully minted!`,
        type: "success",
      });

      setSheepName("");
    } catch (error) {
      handleNotification({
        message: "Failed to mint sheep",
        type: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
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
          className={`block m-auto mb-5 ${
            loading ? "pointer-events-none" : ""
          }`}
          colors={contractState.sheepColors}
          triangle="hide"
          onChange={(color) => setSheepColor(color.hex)}
        />

        <p className="text-center mb-2">Sheep name</p>
        <input
          disabled={loading}
          placeholder="Sheep name"
          type="text"
          value={sheepName}
          onChange={handleNameChange}
          className="mb-5 p-2 rounded-lg mr-2 text-slate-800 border-2 border-slate-600 m-auto block disabled:bg-zinc-500"
        ></input>

        <Button
          onClick={mintSheep}
          className="block m-auto mt-10"
          disabled={loading}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Mint"}
        </Button>
      </div>
    </div>
  );
};

export default NewSheepModal;
