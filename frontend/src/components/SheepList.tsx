import SheepCard from "./SheepCard";
import { Sheep } from "../types";
import { Link } from "react-router-dom";

type Props = {
  sheeps: Array<Sheep>;
  account: string | undefined;
};

const SheepList = ({ sheeps, account }: Props) => {
  return (
    <div className=" max-w-[90vw] m-auto">
      <h1 className="text-center text-3xl mb-10 mt-2">My sheeps</h1>
      {sheeps.length === 0 && (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          {account
            ? "You don't own any sheeps"
            : "Connect your wallet to view your sheeps"}
        </div>
      )}
      <div className="flex flex-wrap justify-center">
        {account &&
          sheeps.map((sheep: Sheep) => (
            <Link
              to={`/sheep/${sheep.id}`}
              key={sheep.id}
              className="mb-4 mx-2"
            >
              <SheepCard sheep={sheep} />
            </Link>
          ))}

        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
        <div aria-hidden className="w-[250px] h-0 mx-2" />
      </div>
    </div>
  );
};

export default SheepList;
