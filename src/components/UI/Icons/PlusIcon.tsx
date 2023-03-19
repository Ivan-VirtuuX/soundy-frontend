export const PlusIcon = ({ color }: { color: string }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.7685 7.62152H8.20648V12.1836C8.20648 12.4255 8.11035 12.6576 7.93924 12.8287C7.76813 12.9998 7.53606 13.096 7.29407 13.096C7.05209 13.096 6.82001 12.9998 6.6489 12.8287C6.4778 12.6576 6.38167 12.4255 6.38167 12.1836V7.62152H1.81963C1.57765 7.62152 1.34557 7.52539 1.17446 7.35428C1.00336 7.18317 0.907227 6.9511 0.907227 6.70911C0.907227 6.46713 1.00336 6.23505 1.17446 6.06394C1.34557 5.89283 1.57765 5.79671 1.81963 5.79671H6.38167V1.23467C6.38167 0.992687 6.4778 0.760613 6.6489 0.589503C6.82001 0.418394 7.05209 0.322266 7.29407 0.322266C7.53606 0.322266 7.76813 0.418394 7.93924 0.589503C8.11035 0.760613 8.20648 0.992687 8.20648 1.23467V5.79671H12.7685C13.0105 5.79671 13.2426 5.89283 13.4137 6.06394C13.5848 6.23505 13.6809 6.46713 13.6809 6.70911C13.6809 6.9511 13.5848 7.18317 13.4137 7.35428C13.2426 7.52539 13.0105 7.62152 12.7685 7.62152Z"
        fill={color ? color : "white"}
      />
    </svg>
  );
};
