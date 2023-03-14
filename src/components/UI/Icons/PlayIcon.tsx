export const PlayIcon = ({
  handleClick,
  className,
}: {
  handleClick: () => void;
  className: string;
}) => {
  return (
    <svg
      onClick={handleClick}
      className={className}
      width="14"
      height="17"
      viewBox="0 0 14 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.9825 16.59C1.54917 16.8717 1.11063 16.8881 0.666899 16.6394C0.223166 16.3907 0.000866667 16.0059 0 15.485V2.03001C0 1.51001 0.222299 1.12522 0.666899 0.875615C1.1115 0.626015 1.55003 0.642482 1.9825 0.925015L12.5775 7.65251C12.9675 7.91251 13.1625 8.28085 13.1625 8.75751C13.1625 9.23418 12.9675 9.60252 12.5775 9.86252L1.9825 16.59Z"
        fill="white"
      />
    </svg>
  );
};
