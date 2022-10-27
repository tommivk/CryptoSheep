import { Contract } from "web3-eth-contract";
import useCountdown from "../hooks/useCountdown";
import { BlockData, ContractState, Sheep } from "../types";
import InfoBox from "./InfoBox";
import Button from "./Button";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Props = {
  contract: Contract;
  account: string | undefined;
  blockData: BlockData;
  contractState: ContractState;
};

const SheepPage = ({ contract, account, blockData, contractState }: Props) => {
  const [owner, setOwner] = useState("");
  const [sheep, setSheep] = useState<Sheep>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { feedingLockDuration, feedingDeadline } = contractState;

  const { id } = useParams();

  const getSheepData = useCallback(
    async (id?: string) => {
      try {
        const sheep: Sheep = await contract?.methods.getSheep(id).call();
        setSheep(sheep);
        const owner = await contract.methods.sheepToOwner(sheep.id).call();
        setOwner(owner);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    getSheepData(id);
  }, [getSheepData, id, blockData.blockNumber]);

  const feed = async (id: string) => {
    try {
      await contract.methods.feed(id).send({ from: account });
    } catch (error) {
      console.error(error);
    }
  };

  const status = sheep?.isAlive ? "Alive" : "Dead";

  const [feedTimeLeft] = useCountdown(
    feedingDeadline - (blockData.blockTime - Number(sheep?.lastFeedTime))
  );
  const [feedingAvailableIn, feedingUnlock] = useCountdown(
    Number(sheep?.lastFeedTime) + feedingLockDuration - blockData.blockTime
  );
  const lastFed = new Date(Number(sheep?.lastFeedTime) * 1000).toLocaleString();

  if (error) return <div>Error</div>;
  if (loading || !sheep) return <div>Loading..</div>;

  return (
    <div className="grid grid-cols-1 grid-flow-row md:grid-cols-2 w-[900px] h-fit bg-slate-800 max-w-[95vw] rounded-lg m-auto mt-20 text-slate-300">
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
          <InfoBox header={"Owner"} value={owner} />
        </div>
      </div>
      <div className="px-2 col-span-1 md:col-span-2 row-span-1 m-auto flex flex-col mb-10 mt-5">
        {account === owner && sheep.isAlive && (
          <>
            {feedingUnlock > 0 ? (
              `Feeding available in: ~ ${feedingAvailableIn}`
            ) : (
              <p className="m-auto ">Time left to feed: ~ {feedTimeLeft}</p>
            )}
            <Button
              className="mt-4"
              onClick={() => feed(sheep.id)}
              disabled={feedingUnlock > 0}
            >
              {feedingUnlock > 0 && <span className="grayscale">🔒</span>} Feed
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SheepPage;
