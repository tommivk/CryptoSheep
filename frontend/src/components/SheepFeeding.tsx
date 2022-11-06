import useCountdown from "../hooks/useCountdown";
import { BlockData, ContractState, NotificationMessage, Sheep } from "../types";
import { Contract } from "web3-eth-contract";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type Props = {
  sheep: Sheep & { owner: string };
  contract: Contract;
  blockData: BlockData;
  contractState: ContractState;
  account: string | undefined;
  handleNotification: (params: NotificationMessage) => void;
};

const SheepFeeding = ({
  sheep,
  contractState,
  contract,
  blockData,
  account,
  handleNotification,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const { feedingLockDuration, feedingDeadline } = contractState;

  const feed = async (id: string) => {
    try {
      setLoading(true);
      await contract.methods.feed(id).send({ from: account });
      handleNotification({
        message: "Sheep successfully feeded!",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      handleNotification({
        message: "Failed to feed the sheep",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const [feedTimeLeft] = useCountdown(
    feedingDeadline - (blockData.blockTime - Number(sheep?.lastFeedTime))
  );
  const [feedingAvailableIn, feedingUnlock] = useCountdown(
    Number(sheep?.lastFeedTime) + feedingLockDuration - blockData.blockTime
  );

  const feedingDisabled = feedingUnlock > 0 && Number(sheep.timesFed) > 0;

  return (
    <>
      {account === sheep.owner && sheep.isAlive && (
        <div className="px-2 m-auto flex flex-col pb-5">
          <>
            {feedingDisabled ? (
              <p className="m-auto">
                Feeding available in: ~ {feedingAvailableIn}
              </p>
            ) : (
              <p className="m-auto">Time left to feed: ~ {feedTimeLeft}</p>
            )}
            <Button
              className="mt-4 block w-fit m-auto"
              onClick={() => feed(sheep.id)}
              disabled={feedingDisabled}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <>
                  {feedingDisabled && <span className="grayscale">🔒</span>}{" "}
                  Feed
                </>
              )}
            </Button>
          </>
        </div>
      )}
    </>
  );
};

export default SheepFeeding;
