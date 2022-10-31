import { Link } from "react-router-dom";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

type Props = {
  account: string | undefined;
  connectWallet: () => Promise<void>;
};

const Navigation = ({ account, connectWallet }: Props) => {
  const copyAddress = () => {
    navigator?.clipboard?.writeText(account!);
  };

  return (
    <nav className="max-w-full py-3 px-8 h-navbarHeight z-40 relative">
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
            <Button onClick={copyAddress} className="group">
              {account.substring(0, 10)}
              {"..."}
              {account.substring(account.length - 10)}{" "}
              <FontAwesomeIcon
                icon={faCopy}
                className="h-4 pl-2 group-hover:text-gray-400"
              ></FontAwesomeIcon>
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
