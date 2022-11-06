import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Loading = () => {
  return (
    <div className="h-[calc(100vh-theme(spacing.navbarHeight))] flex justify-center items-center">
      <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
    </div>
  );
};

export default Loading;
