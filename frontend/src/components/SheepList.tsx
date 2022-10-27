import SheepCard from "./SheepCard";
import { Sheep } from "../types";
import { Link } from "react-router-dom";

type Props = {
  sheeps: Array<Sheep>;
  account: string | undefined;
};

const SheepList = ({ sheeps, account }: Props) => {
  return (
    <div>
      <h1>My sheeps</h1>
      <div className="flex flex-wrap gap-5">
        {account &&
          sheeps.map((sheep: Sheep) => (
            <Link to={`/sheep/${sheep.id}`} key={sheep.id}>
              <SheepCard sheep={sheep} />
            </Link>
          ))}
      </div>
    </div>
  );
};

export default SheepList;
