export const CheckMarkIcon = ({
  color,
  size,
}: {
  color?: string;
  size?: number;
}) => {
  return (
    <svg
      width={size ? size : 11}
      height={size ? size : 11}
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.02998 6.71147L9.0831 1.65835C9.27217 1.46929 9.51279 1.37476 9.80498 1.37476C10.0972 1.37476 10.3378 1.46929 10.5269 1.65835C10.7159 1.84741 10.8104 2.08804 10.8104 2.38022C10.8104 2.67241 10.7159 2.91304 10.5269 3.1021L4.75186 8.8771C4.54561 9.08335 4.30498 9.18647 4.02998 9.18647C3.75498 9.18647 3.51436 9.08335 3.30811 8.8771L0.626855 6.19585C0.437793 6.00679 0.343262 5.76616 0.343262 5.47397C0.343262 5.18179 0.437793 4.94116 0.626855 4.7521C0.815918 4.56304 1.05654 4.46851 1.34873 4.46851C1.64092 4.46851 1.88154 4.56304 2.07061 4.7521L4.02998 6.71147Z"
        fill={color ? color : "#898989"}
      />
    </svg>
  );
};
