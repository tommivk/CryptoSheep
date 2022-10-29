import { Link } from "react-router-dom";
import Button from "./Button";

type Props = {
  account: string | undefined;
  connectWallet: () => Promise<void>;
};

const Navigation = ({ account, connectWallet }: Props) => {
  const copyAddress = () => {
    navigator?.clipboard?.writeText(account!);
  };

  return (
    <nav className="max-w-full p-3 h-navbarHeight">
      <ul className="flex items-center flex-wrap gap-2 ">
        <Link to="/" className="text-2xl font-semibold  tracking-tight">
          CryptoSheeps
        </Link>
        <li className="ml-auto mr-20 font-medium">
          <Link to="/">Mint</Link>
        </li>
        <li className="mr-auto font-medium">
          <Link to="/sheep">My sheeps</Link>
        </li>
        <li>
          {account ? (
            <Button onClick={copyAddress}>
              {account.substring(0, 10)}
              {"..."}
              {account.substring(account.length - 10)}
            </Button>
          ) : (
            <Button onClick={connectWallet}>Connect wallet</Button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
