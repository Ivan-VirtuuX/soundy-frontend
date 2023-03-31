import React from "react";

import { convertDate } from "@/utils/dateConverter";

export const useInterval = (interval: number, date: Date) => {
  const [convertedDate, setConvertedDate] = React.useState(
    convertDate(new Date(date))
  );

  const intervalCallback = React.useCallback(() => {
    setConvertedDate(convertDate(new Date(date)));
  }, []);

  React.useEffect(() => {
    const timeout = setInterval(() => {
      const newDate = convertDate(new Date(date));

      if (
        newDate.split(" ")[1].includes("секунд") ||
        newDate === "2 минуты назад"
      ) {
        setConvertedDate(newDate);
      } else {
        clearInterval(timeout);
      }
    }, interval);

    return () => clearInterval(timeout);
  }, [intervalCallback]);

  return { convertedDate };
};
