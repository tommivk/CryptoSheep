import { Sheep } from "../types";

type Props = {
  sheep: Sheep;
};

const SheepCard = ({ sheep }: Props) => {
  const status = sheep.isAlive ? "Alive" : "Dead";
  const feedDate = new Date(
    Number(sheep.lastFeedTime) * 1000
  ).toLocaleDateString();

  return (
    <div className="w-[250px] bg-slate-800 max-w-screen box-border rounded-md text-slate-300 py-4 px-2">
      <h3 className="mb-2 mx-3 text-slate-400">#{sheep.id}</h3>
      <img
        className="w-[95%] m-auto bg-slate-700"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(sheep.svg)}`}
      ></img>
      <div className="max-h-fit max-w-[100%]">
        <h2 className="text-center bold pb-2 mt-2 text-xl font-bold">
          {sheep.name}
        </h2>
        <table className="m-auto">
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
                <p>{feedDate} </p>
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
      </div>
    </div>
  );
};

export default SheepCard;
