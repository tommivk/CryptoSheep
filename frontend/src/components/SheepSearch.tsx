import { useRef, useState } from "react";
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
  const [sheep, error] = useFetchSheep({ id: search, blockData, contract });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!inputRef.current) return;
    setSearch(inputRef.current.value);
  };

  return (
    <div>
      <h1 className="text-2xl text-center mt-10 mb-10">Search sheeps by ID</h1>
      <div className="m-auto w-fit mb-10">
        <input
          type="number"
          min={0}
          ref={inputRef}
          className="m-auto text-slate-500 px-5 py-2 mr-2 rounded-md"
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
