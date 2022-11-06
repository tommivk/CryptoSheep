import { useState } from "react";
import Button from "./Button";
import graySheep from "/graySheep.svg";
import { ContractState, NotificationMessage } from "../types";
import { Contract } from "web3-eth-contract";
import NewSheepModal from "./NewSheepModal";

type Props = {
  account: string | undefined;
  connectWallet: () => Promise<void>;
  contract: Contract;
  contractState: ContractState;
  handleNotification: (params: NotificationMessage) => void;
};

const Mint = ({
  account,
  connectWallet,
  contract,
  contractState,
  handleNotification,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState({
    sheep1: false,
    sheep2: false,
    sheep3: false,
  });

  return (
    <div className="h-[100vh] w-[100vw] absolute top-0 bg-slate-700 bg-sheepBG bg-no-repeat bg-cover bg-bottom">
      <div className="h-[10vh] min-h-[80px] w-full absolute top-0 bg-gradient-to-b from-slate-700 to-[#fff0]"></div>
      {modalOpen && (
        <NewSheepModal
          account={account}
          connectWallet={connectWallet}
          contract={contract}
          contractState={contractState}
          setModalOpen={setModalOpen}
          handleNotification={handleNotification}
        />
      )}
      <div className="overflow-hidden relative h-[100%] w-[100%]">
        <Button
          onClick={() => {
            setModalOpen(true);
            setIsHovered({ sheep1: true, sheep2: true, sheep3: true });
          }}
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  hover:text-gray-600 text-slate-100 font-bold bg-opacity-0 hover:bg-opacity-100 border-2 border-slate-100 px-10 py-4 hover:bg-slate-200"
        >
          Mint
        </Button>

        <img
          onMouseOver={() => setIsHovered({ ...isHovered, sheep1: true })}
          className={`mt-5 hidden md:block absolute h-40  left-[30vw] bottom-[20vh] ${
            isHovered.sheep1 ? "animate-jump" : ""
          }`}
          src={graySheep}
        ></img>
        <img
          onMouseOver={() => setIsHovered({ ...isHovered, sheep2: true })}
          className={`mt-5 hidden md:block absolute h-60 right-[5vw] bottom-[0vh] ${
            isHovered.sheep2 ? "animate-jump" : "animate-moveLeft"
          }`}
          src={graySheep}
        ></img>
        <img
          onMouseOver={() => setIsHovered({ ...isHovered, sheep3: true })}
          className={`mt-5 absolute h-60 bottom-[3vh] left-[10vw] ${
            isHovered.sheep3 ? "animate-jump" : ""
          }`}
          src={graySheep}
        ></img>
      </div>
    </div>
  );
};

export default Mint;
