import useCountdown from "../hooks/useCountdown";
import { BlockData, ContractState, Sheep } from "../types";
import { Contract } from "web3-eth-contract";
import Button from "./Button";

type Props = {
  sheep: Sheep & { owner: string };
  contract: Contract;
  blockData: BlockData;
  contractState: ContractState;
  account: string | undefined;
};

const SheepFeeding = ({
  sheep,
  contractState,
  contract,
  blockData,
  account,
}: Props) => {
  const { feedingLockDuration, feedingDeadline } = contractState;

  const feed = async (id: string) => {
    try {
      await contract.methods.feed(id).send({ from: account });
    } catch (error) {
      console.error(error);
    }
  };

  const [feedTimeLeft] = useCountdown(
    feedingDeadline - (blockData.blockTime - Number(sheep?.lastFeedTime))
  );
  const [feedingAvailableIn, feedingUnlock] = useCountdown(
    Number(sheep?.lastFeedTime) + feedingLockDuration - blockData.blockTime
  );

  return (
    <>
      {account === sheep.owner && sheep.isAlive && (
        <div className="px-2 m-auto flex flex-col pb-5">
          <>
            {feedingUnlock > 0 ? (
              <p className="m-auto">
                Feeding available in: ~ {feedingAvailableIn}
              </p>
            ) : (
              <p className="m-auto">Time left to feed: ~ {feedTimeLeft}</p>
            )}
            <Button
              className="mt-4 block w-fit m-auto"
              onClick={() => feed(sheep.id)}
              disabled={feedingUnlock > 0}
            >
              {feedingUnlock > 0 && <span className="grayscale">🔒</span>} Feed
            </Button>
          </>
        </div>
      )}
    </>
  );
};

export default SheepFeeding;
