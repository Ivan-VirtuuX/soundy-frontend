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
      width="20"
      height="20"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.65679 15.2794C4.29465 15.5148 3.92816 15.5285 3.55733 15.3207C3.1865 15.1128 3.00072 14.7912 3 14.3559V3.1115C3 2.67693 3.18578 2.35535 3.55733 2.14676C3.92889 1.93817 4.29537 1.95193 4.65679 2.18805L13.5111 7.81026C13.837 8.02754 14 8.33536 14 8.73371C14 9.13207 13.837 9.43989 13.5111 9.65717L4.65679 15.2794Z"
        fill="white"
      />
    </svg>
  );
};
