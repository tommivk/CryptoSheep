import SheepCard from "./SheepCard";
import { Sheep } from "../types";
import { Link } from "react-router-dom";
import Loading from "./Loading";

type Props = {
  sheep: Array<Sheep> | undefined;
  account: string | undefined;
};

const SheepList = ({ sheep, account }: Props) => {
  if (!account) {
    return (
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        Connect your wallet to view your sheep
      </div>
    );
  }

  if (!sheep) {
    return <Loading />;
  }

  return (
    <div className=" max-w-[90vw] m-auto">
      <h1 className="text-center text-3xl mb-10 mt-2">My sheep</h1>
      {sheep.length === 0 && (
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          You don't own any sheep
        </div>
      )}
      <div className="flex flex-wrap justify-center">
        {account &&
          sheep.map((sheep: Sheep) => (
            <Link
              to={`/sheep/${sheep.id}`}
              key={sheep.id}
              className="mb-4 mx-3"
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
