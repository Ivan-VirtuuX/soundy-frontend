import React from "react";
import { Button } from "@material-ui/core";
import styles from "./BlueButton.module.scss";

export const BlueButton = ({
  children,
  text,
  handleClick,
  disabled,
  variant,
  size,
  color,
}: {
  children?: React.ReactNode;
  text: string;
  handleClick?: () => void;
  disabled?: boolean;
  variant?: string;
  size?: string;
  color?: "primary" | "secondary" | "green";
}) => {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div>
      {variant === "transparent" ? (
        <Button
          variant="text"
          className={styles.blueButton}
          onClick={handleClick}
          disabled={disabled}
          style={{
            justifyContent: "flex-start",
          }}
        >
          {children}
          {text}
        </Button>
      ) : size === "sm" ? (
        <Button
          size="small"
          variant="contained"
          className={styles.blueButton}
          onClick={handleClick}
          disabled={disabled}
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
          className={styles.blueButton}
          onClick={handleClick}
          disabled={disabled}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={{
            background: !isHover ? "#E8338B" : "#181F92",
            display: "block",
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
          className={styles.blueButton}
          onClick={handleClick}
          disabled={disabled}
        >
          <div
            style={{ display: "flex", marginRight: 10 }}
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
          }`}
          onClick={handleClick}
          disabled={disabled}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          style={{
            background: !isHover ? "#7DCF3C" : "#8A40DB",
            display: "block",
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
