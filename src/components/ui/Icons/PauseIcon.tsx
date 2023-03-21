export const PauseIcon = ({
  handleClick,
  className,
}: {
  handleClick: () => void;
  className: string;
}) => {
  return (
    <svg
      className={className}
      onClick={handleClick}
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.25 15.9376C5.41875 15.9376 6.375 14.9813 6.375 13.8126V3.18756C6.375 2.01881 5.41875 1.06256 4.25 1.06256C3.08125 1.06256 2.125 2.01881 2.125 3.18756V13.8126C2.125 14.9813 3.08125 15.9376 4.25 15.9376ZM10.625 3.18756V13.8126C10.625 14.9813 11.5813 15.9376 12.75 15.9376C13.9187 15.9376 14.875 14.9813 14.875 13.8126V3.18756C14.875 2.01881 13.9187 1.06256 12.75 1.06256C11.5813 1.06256 10.625 2.01881 10.625 3.18756Z"
        fill="white"
      />
    </svg>
  );
};
