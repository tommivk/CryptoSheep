import { Contract } from "web3-eth-contract";
import { BlockData, ContractState, NotificationMessage } from "../types";
import { useParams } from "react-router-dom";
import useFetchSheep from "../hooks/useFetchSheep";
import SheepDetails from "./SheepDetails";
import SheepFeeding from "./SheepFeeding";
import Card from "./Card";
import Loading from "./Loading";
import ErrorPage from "./ErrorPage";

type Props = {
  contract: Contract;
  account: string | undefined;
  blockData: BlockData;
  contractState: ContractState;
  handleNotification: (params: NotificationMessage) => void;
};

const SheepPage = ({
  contract,
  account,
  blockData,
  contractState,
  handleNotification,
}: Props) => {
  const { id } = useParams();

  const [sheep, error] = useFetchSheep({ id, blockData, contract });

  if (error) return <ErrorPage code={500} text="Internal server error" />;
  if (!sheep) return <Loading />;

  return (
    <div className="pb-20">
      <Card className="mt-20">
        <SheepDetails sheep={sheep} account={account} />
        <SheepFeeding
          handleNotification={handleNotification}
          account={account}
          sheep={sheep}
          blockData={blockData}
          contract={contract}
          contractState={contractState}
        />
      </Card>
    </div>
  );
};

export default SheepPage;
