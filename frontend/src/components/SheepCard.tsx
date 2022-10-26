import { Contract } from "web3-eth-contract";
import { BlockData, Sheep } from "../types";
import Button from "./Button";
import useCountdown from "../hooks/useCountdown";

type Props = {
  sheep: Sheep;
  contract: Contract;
  account: string;
  blockData: BlockData;
};

const feedUnlock = 60;
const feedDeadline = 60 * 3;

const SheepCard = ({ sheep, contract, account, blockData }: Props) => {
  const feed = async (id: string) => {
    try {
      await contract.methods.feed(id).send({ from: account });
    } catch (error) {
      console.error(error);
    }
  };

  const status = sheep.isAlive ? "Alive" : "Dead";
  const feedDate = new Date(Number(sheep.lastFeedTime) * 1000);

  const [feedTimeLeft, feedDeadlineSeconds] = useCountdown(
    feedDeadline - (blockData.blockTime - Number(sheep.lastFeedTime))
  );
  const [_, feedingUnlock] = useCountdown(
    Number(sheep.lastFeedTime) + feedUnlock - blockData.blockTime
  );

  return (
    <div className="w-[250px]  bg-slate-800  max-w-screen box-border rounded-md text-slate-300">
      <h3 className="my-2 mx-5 text-slate-400">#{sheep.id}</h3>
      <img
        className="w-[90%] m-auto bg-slate-700"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(sheep.svg)}`}
      ></img>
      <div className="max-h-fit max-w-[100%]">
        <h2 className="text-center bold pb-2 mt-2 text-xl font-bold">
          {sheep.name}
        </h2>
        <table className="m-auto mb-3">
          <tbody>
            <tr>
              <td>
                <p className="pr-2">Level:</p>
              </td>
              <td>
                <p>{sheep.level}</p>
              </td>
            </tr>
            <tr>
              <td className="pr-2">
                <p>Last fed:</p>
              </td>
              <td>
                <p>{feedDate.toLocaleDateString()} </p>
              </td>
            </tr>
            <tr>
              <td className="pr-2">
                <p>Status:</p>
              </td>
              <td>
                <p
                  className={`${
                    sheep.isAlive ? "text-green-300" : "text-red-500"
                  }`}
                >
                  {status}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        {sheep.isAlive && (
          <>
            {
              <p className="text-center m-2">
                Time left to feed: {feedTimeLeft}
              </p>
            }
            {feedDeadlineSeconds > 0 && (
              <Button
                className="m-auto mb-3 py-2  block"
                onClick={() => feed(sheep.id)}
              >
                {feedingUnlock > 0 ? feedingUnlock : "Feed"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SheepCard;
