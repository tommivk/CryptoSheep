import { useEffect, useState } from "react";
import { Duration } from "luxon";

const useCountdown = (time: number) => {
  const [remaining, setRemaining] = useState<number>(time);

  const duration = Duration.fromObject({
    seconds: remaining > 0 ? remaining : 0,
  });
  const timeString = duration.toFormat("hh:mm:ss");

  useEffect(() => {
    setRemaining(time);
    const countdown = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [time]);

  return [timeString, duration.seconds];
};

export default useCountdown;
