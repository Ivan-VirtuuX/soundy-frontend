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
      width="20"
      height="20"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.77693 14.9375C5.79344 14.9375 6.62514 14.1058 6.62514 13.0893V3.84821C6.62514 2.8317 5.79344 2 4.77693 2C3.76041 2 2.92871 2.8317 2.92871 3.84821V13.0893C2.92871 14.1058 3.76041 14.9375 4.77693 14.9375ZM10.3216 3.84821V13.0893C10.3216 14.1058 11.1533 14.9375 12.1698 14.9375C13.1863 14.9375 14.018 14.1058 14.018 13.0893V3.84821C14.018 2.8317 13.1863 2 12.1698 2C11.1533 2 10.3216 2.8317 10.3216 3.84821Z"
        fill="white"
      />
    </svg>
  );
};
