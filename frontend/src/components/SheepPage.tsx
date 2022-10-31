import { Contract } from "web3-eth-contract";
import { BlockData, ContractState } from "../types";
import { useParams } from "react-router-dom";
import useFetchSheep from "../hooks/useFetchSheep";
import SheepDetails from "./SheepDetails";
import SheepFeeding from "./SheepFeeding";
import Card from "./Card";

type Props = {
  contract: Contract;
  account: string | undefined;
  blockData: BlockData;
  contractState: ContractState;
};

const SheepPage = ({ contract, account, blockData, contractState }: Props) => {
  const { id } = useParams();

  const [sheep, error] = useFetchSheep({ id, blockData, contract });

  if (error) return <div>Error</div>;
  if (!sheep) return <></>;

  return (
    <Card className="mt-20">
      <SheepDetails sheep={sheep} account={account} />
      <SheepFeeding
        account={account}
        sheep={sheep}
        blockData={blockData}
        contract={contract}
        contractState={contractState}
      />
    </Card>
  );
};

export default SheepPage;
