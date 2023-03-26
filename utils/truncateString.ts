export const truncateString = (str: string, len: number): string =>
  str.length > len ? str.slice(0, len) + "..." : str;
