import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { Contract } from "web3-eth-contract";
import { BlockData, ContractState } from "../types";
import useFetchSheep from "../hooks/useFetchSheep";
import SheepDetails from "./SheepDetails";
import Card from "./Card";

type Props = {
  contract: Contract;
  account: string | undefined;
  blockData: BlockData;
};

const SheepSearch = ({ contract, account, blockData }: Props) => {
  const [search, setSearch] = useState("");
  const [totalSheepCount, setTotalSheepCount] = useState<number>();

  const [sheep, error] = useFetchSheep({ id: search, blockData, contract });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    contract.methods
      .totalSheepCount()
      .call()
      .then((result: string) => setTotalSheepCount(Number(result)));
  }, [blockData.blockNumber]);

  const handleSearch = () => {
    if (!inputRef.current) return;
    setSearch(inputRef.current.value);
  };

  return (
    <div className="pb-20">
      <h1 className="text-2xl text-center mt-10 mb-10">
        Search sheeps by ID{" "}
        {totalSheepCount && (
          <span className="text-gray-400 text-lg">
            {"(0 - "}
            {totalSheepCount - 1}
            {")"}
          </span>
        )}
      </h1>
      <div className="mb-10 flex justify-center mx-5">
        <input
          type="number"
          min={0}
          ref={inputRef}
          className="text-slate-500 min-w-[80px] px-5 py-2 mr-2 rounded-md border-2 border-lightBorder"
          placeholder="Sheep ID"
        ></input>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {error && <div className="text-center">No sheep found :(</div>}
      {sheep && (
        <Card>
          <SheepDetails sheep={sheep} account={account} />
        </Card>
      )}
    </div>
  );
};

export default SheepSearch;
