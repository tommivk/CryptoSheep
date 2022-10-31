import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { NotificationMessage } from "../types";

type Props = {
  notification: NotificationMessage;
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationMessage | undefined>
  >;
};

const Notification = ({ notification, setNotification }: Props) => {
  return (
    <div
      onClick={() => setNotification(undefined)}
      className={`fixed z-50 cursor-pointer max-w-[90vw] bottom-5 right-5 flex items-center justify-center w-fit ${
        notification.type === "success" ? "bg-blue-500" : "bg-red-500"
      } opacity-90 rounded-lg px-5 py-3`}
    >
      <FontAwesomeIcon
        className="notification-icon h-7 pr-3"
        icon={faExclamationCircle}
      />
      <div className="text-md font-medium">{notification.message}</div>
    </div>
  );
};

export default Notification;
