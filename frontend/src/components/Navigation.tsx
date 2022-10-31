import { Link } from "react-router-dom";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { NotificationMessage } from "../types";

type Props = {
  account: string | undefined;
  connectWallet: () => Promise<void>;
  handleNotification: (params: NotificationMessage) => void;
};

const Navigation = ({ account, connectWallet, handleNotification }: Props) => {
  const copyAddress = () => {
    try {
      navigator?.clipboard?.writeText(account!);
      handleNotification({ message: "Address copied", type: "success" });
    } catch (e) {
      handleNotification({ message: "Couldn't copy address", type: "error" });
    }
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
