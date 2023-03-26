import React from "react";
import { Button } from "@material-ui/core";
import styles from "./BlueButton.module.scss";

interface BlueButtonProps {
  children?: React.ReactNode;
  text: string;
  handleClick?: () => void;
  disabled?: boolean;
  variant?: string;
  size?: string;
  color?: "primary" | "secondary" | "green";
  className?: string;
  width?: number;
}

export const BlueButton: React.FC<BlueButtonProps> = ({
  children,
  text,
  handleClick,
  disabled,
  variant,
  size,
  color,
  className,
  width,
}) => {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div>
      {variant === "transparent" ? (
        <Button
          variant="text"
          className={`${styles.blueButton} ${className && className}`}
          onClick={handleClick}
          disabled={disabled}
          style={{
            justifyContent: "flex-start",
            width: width && width,
          }}
        >
          {children}
          {text}
        </Button>
      ) : size === "sm" ? (
        <Button
          size="small"
          variant="contained"
          className={`${styles.blueButton} ${className && className}`}
          onClick={handleClick}
          disabled={disabled}
          style={{
            width: width && width,
          }}
        >
          <div
            style={{ display: "flex" }}
            className={`${
              disabled ? "blueButtonDisabled" : styles.defaultSmallButton
            }`}
          >
            {children}
          </div>
          {text}
        </Button>
      ) : color === "secondary" ? (
        <Button
          variant="contained"
          className={`${styles.blueButton} ${className && className}`}
          onClick={handleClick}
          disabled={disabled}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={{
            background: !isHover ? "#E8338B" : "#181F92",
            display: "block",
            width: width && width,
          }}
        >
          <div
            style={{ display: "flex" }}
            className={`${disabled ? "blueButtonDisabled" : ""}`}
          >
            {children}
          </div>
          {text}
        </Button>
      ) : color === "primary" ? (
        <Button
          variant="contained"
          className={`${styles.blueButton} ${className && className}`}
          onClick={handleClick}
          disabled={disabled}
          style={{
            width: width && width,
          }}
        >
          <div
            style={{ display: "flex", marginRight: children ? 10 : 0 }}
            className={`${disabled ? "blueButtonDisabled" : styles.blueButton}`}
          >
            {children}
          </div>
          {text}
        </Button>
      ) : (
        <Button
          variant="contained"
          className={`${styles.blueButton} ${
            disabled ? "greenButtonDisabled" : ""
          } ${className && className}`}
          onClick={handleClick}
          disabled={disabled}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={{
            background: !isHover ? "#7DCF3C" : "#8A40DB",
            display: "block",
            width: width && width,
          }}
        >
          <div
            style={{ display: "flex" }}
            className={`${disabled ? "blueButtonDisabled" : ""}`}
          >
            {children}
          </div>
          {text}
        </Button>
      )}
    </div>
  );
};
