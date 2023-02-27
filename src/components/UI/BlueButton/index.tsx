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
}: {
  children: React.ReactNode;
  text: string;
  handleClick?: () => void;
  disabled?: boolean;
  variant?: string;
  size?: string;
}) => {
  return (
    <div>
      {variant === "transparent" ? (
        <Button
          variant="text"
          className={styles.blueButton}
          onClick={handleClick}
          disabled={disabled}
          style={{ justifyContent: "flex-start" }}
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
      ) : (
        <Button
          variant="contained"
          className={styles.blueButton}
          onClick={handleClick}
          disabled={disabled}
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
