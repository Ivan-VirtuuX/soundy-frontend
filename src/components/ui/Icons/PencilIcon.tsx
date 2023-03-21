export const PencilIcon = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <svg
      width={width ? width : 15}
      height={height ? height : 15}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.6882 5.01322L8.64066 2.00154L9.64455 0.997648C9.91943 0.722773 10.2572 0.585335 10.6578 0.585335C11.0584 0.585335 11.3959 0.722773 11.6703 0.997648L12.6742 2.00154C12.949 2.27642 13.0925 2.60818 13.1044 2.99683C13.1164 3.38548 12.9849 3.71701 12.71 3.9914L11.6882 5.01322ZM10.6484 6.0709L3.04754 13.6718H0V10.6243L7.60091 3.02336L10.6484 6.0709Z"
        fill="white"
      />
    </svg>
  );
};
