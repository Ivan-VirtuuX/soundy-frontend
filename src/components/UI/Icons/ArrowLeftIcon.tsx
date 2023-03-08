import React from "react";

export const ArrowLeftIcon = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <svg
      onClick={handleClick}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.0941 22.4119C13.353 22.153 13.4885 21.8236 13.5007 21.4236C13.513 21.0236 13.3892 20.6942 13.1294 20.4354L6.21178 13.5177H21.9883C22.3883 13.5177 22.7238 13.3822 22.9948 13.1112C23.2659 12.8401 23.401 12.505 23.4 12.106C23.4 11.706 23.2645 11.3705 22.9934 11.0994C22.7224 10.8283 22.3873 10.6933 21.9883 10.6942H6.21178L13.1294 3.77657C13.3883 3.51775 13.512 3.18834 13.5007 2.78834C13.4894 2.38834 13.3539 2.05892 13.0941 1.8001C12.8353 1.54128 12.5059 1.41187 12.1059 1.41187C11.7059 1.41187 11.3765 1.54128 11.1177 1.8001L1.80002 11.1177C1.65884 11.2354 1.55861 11.3827 1.49931 11.5596C1.44002 11.7366 1.41084 11.9187 1.41178 12.106C1.41178 12.2942 1.44096 12.4707 1.49931 12.6354C1.55766 12.8001 1.6579 12.953 1.80002 13.0942L11.1177 22.4119C11.3765 22.6707 11.7059 22.8001 12.1059 22.8001C12.5059 22.8001 12.8353 22.6707 13.0941 22.4119Z"
        fill="#181F92"
      />
    </svg>
  );
};
