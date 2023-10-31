export const filterItems = <K>(
  items: K[],
  key: string | string[],
  keyWord: string
): K[] => {
  return typeof key === "string"
    ? items.filter((item) =>
        item[key].toLowerCase().includes(keyWord.toLowerCase())
      )
    : items.filter(
        (item) =>
          key
            .map(
              (k) =>
                item[k].toLowerCase().includes(keyWord.toLowerCase()) && item
            )
            .filter((el) => el).length !== 0 && item
      );
};
