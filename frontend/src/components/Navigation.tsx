import { Link } from "react-router-dom";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { Menu } from "@headlessui/react";
import { NotificationMessage } from "../types";
import {
  faSquareArrowUpRight,
  faArrowDown,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  account: string | undefined;
  balance: string | undefined;
  connectWallet: () => Promise<void>;
  handleNotification: (params: NotificationMessage) => void;
};

const Navigation = ({
  account,
  balance,
  connectWallet,
  handleNotification,
}: Props) => {
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
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight min-w-[220px]"
        >
          CryptoSheeps
        </Link>
        <li className="ml-auto mr-20 font-medium">
          <Link to="/">Mint</Link>
        </li>
        <li className="mr-20 font-medium">
          <Link to="/search">Search</Link>
        </li>
        <li className="mr-auto font-medium">
          <Link to="/sheep">My sheeps</Link>
        </li>
        <li className="min-w-[220px]">
          <Menu>
            {({ open }) => (
              <>
                {account ? (
                  <Menu.Button>
                    <div className="flex justify-end items-center group w-fit ml-auto px-4 py-1 rounded-lg border-2 bg-d border-zinc-500">
                      {account.substring(0, 9)}
                      {"..."}
                      {account.substring(account.length - 7)}
                      <FontAwesomeIcon
                        className="ml-3 group-hover:text-gray-400 "
                        icon={open ? faArrowUp : faArrowDown}
                      />
                    </div>
                  </Menu.Button>
                ) : (
                  <div
                    className="text-right cursor-pointer ml-auto px-4 py-1 w-fit rounded-lg border-2 bg-d border-zinc-500"
                    onClick={connectWallet}
                  >
                    Connect Wallet
                  </div>
                )}
                <Transition
                  show={open}
                  enter="transition duration-200 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-100 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="relative">
                    <Menu.Item disabled>
                      <div className="h-60 p-3 bg-darkMain text-slate-200 absolute border-zinc-700 border-2 right-0 top-5 w-[350px] max-w-[90vw]  rounded-md">
                        <div className="flex items-center justify-center">
                          <span className="text-lg">
                            {" "}
                            {account?.substring(0, 9)}
                            {"..."}
                            {account?.substring(account?.length - 7)}
                          </span>
                          <FontAwesomeIcon
                            onClick={copyAddress}
                            icon={faCopy}
                            className="text-xl pl-4 cursor-pointer hover:text-gray-400"
                          ></FontAwesomeIcon>
                          <a
                            className="flex pl-3"
                            href={`https://goerli.etherscan.io/address/${account}`}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <FontAwesomeIcon
                              icon={faSquareArrowUpRight}
                              className="text-xl  cursor-pointer hover:text-gray-400"
                            />
                          </a>
                        </div>
                        <div>
                          <p className="text-4xl text-center mt-4">ETH</p>
                          <p className="text-center mt-2">{balance}</p>
                        </div>
                      </div>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
