export const MessageIcon = ({
  width,
  height,
  color,
}: {
  width: number;
  height: number;
  color?: string;
}) => {
  return (
    <svg
      width={width ? width : 24}
      height={height ? height : 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_100_368)">
        <path
          d="M12 10V10.0133M6.66671 10V10.0133M17.3334 10V10.0133M1.33337 23.3333V6C1.33337 4.93913 1.7548 3.92172 2.50495 3.17157C3.25509 2.42143 4.27251 2 5.33337 2H18.6667C19.7276 2 20.745 2.42143 21.4951 3.17157C22.2453 3.92172 22.6667 4.93913 22.6667 6V14C22.6667 15.0609 22.2453 16.0783 21.4951 16.8284C20.745 17.5786 19.7276 18 18.6667 18H6.66671L1.33337 23.3333Z"
          stroke={color ? color : "#181F92"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_100_368">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
