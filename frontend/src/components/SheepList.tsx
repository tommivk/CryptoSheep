import { Contract } from "web3-eth-contract";
import SheepCard from "./SheepCard";
import { BlockData, Sheep } from "../types";

type Props = {
  sheeps: Array<Sheep>;
  account: string | undefined;
  contract: Contract;
  blockData: BlockData;
};

const SheepList = ({ sheeps, account, contract, blockData }: Props) => {
  return (
    <div>
      <h1>My sheeps</h1>
      <div className="flex flex-wrap gap-5">
        {account &&
          sheeps.map((sheep: any, i) => (
            <SheepCard
              key={i}
              sheep={sheep}
              contract={contract}
              account={account}
              blockData={blockData}
            />
          ))}
      </div>
    </div>
  );
};

export default SheepList;
