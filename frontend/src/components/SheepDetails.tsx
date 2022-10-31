import { Sheep } from "../types";
import InfoBox from "./InfoBox";

type Props = {
  sheep: Sheep & { owner: string };
  account: string | undefined;
};

const SheepDetails = ({ sheep, account }: Props) => {
  const lastFed = new Date(Number(sheep?.lastFeedTime) * 1000).toLocaleString();
  const status = sheep?.isAlive ? "Alive" : "Dead";

  return (
    <div className="mt-20 pb-10 grid grid-cols-1 grid-flow-row md:grid-cols-2 w-[900px] max-w-[95vw] h-fit">
      <h1 className="col-span-1 md:col-span-2 row-span-1 mx-auto mt-10 mb-5 text-3xl">
        Sheep #{sheep.id}
      </h1>
      <div className="row-span-4">
        <img
          className="w-[70%] m-auto mt-5 bg-slate-700 rounded-md"
          src={`data:image/svg+xml;utf8,${encodeURIComponent(sheep.svg)}`}
        ></img>
      </div>
      <div className="row-span-4">
        <div className="mx-auto w-[95%] sm:w-[70%] flex flex-col gap-3 mt-5 ">
          <InfoBox header={"Name"} value={sheep.name} />
          <InfoBox header={"Level"} value={sheep.level} />
          <InfoBox
            header={"Status"}
            value={status}
            className={sheep.isAlive ? "text-green-300" : "text-red-500"}
          />
          <InfoBox header={"Last fed"} value={lastFed} />
          <InfoBox
            header={"Owner"}
            value={`${sheep.owner} ${sheep.owner === account ? "(You)" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SheepDetails;
