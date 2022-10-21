import { useCallback, useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";
import SheepCard from "./SheepCard";

type Props = {
  account: string | undefined;
  contract: Contract;
};

const SheepList = ({ account, contract }: Props) => {
  const [sheeps, setSheeps] = useState([]);

  const getSheeps = useCallback(async () => {
    const result = await contract.methods
      .getOwnedSheeps()
      .call({ from: account });
    setSheeps(result);
  }, [account]);

  useEffect(() => {
    if (account) {
      getSheeps();
    }
  }, [getSheeps, account]);

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
            />
          ))}
      </div>
    </div>
  );
};

export default SheepList;
