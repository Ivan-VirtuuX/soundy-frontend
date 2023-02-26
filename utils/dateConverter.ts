export const convertDate = (date: Date): string => {
  const timeMs = date.getTime();

  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  const cutoffs = [
    60,
    3600,
    86400,
    86400 * 7,
    86400 * 30,
    86400 * 365,
    Infinity,
  ];

  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  );

  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  const rtf = new Intl.RelativeTimeFormat("ru", {
    numeric: "auto",
    localeMatcher: "best fit",
  });

  const formattedDate = rtf.format(
    Math.floor(deltaSeconds / divisor),
    units[unitIndex]
  );

  return !formattedDate.includes("назад")
    ? formattedDate +
        " в " +
        new Date(date).toLocaleTimeString("ru-Ru", {
          hour: "numeric",
          minute: "2-digit",
        })
    : formattedDate;
};
