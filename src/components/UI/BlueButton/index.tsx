import React from "react";
import { Button } from "@material-ui/core";
import styles from "./BlueButton.module.scss";

export const BlueButton = ({
  children,
  text,
  handleClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  text: string;
  handleClick?: () => void;
  disabled?: boolean;
  variant?: string;
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
      ) : (
        <Button
          variant="contained"
          className={styles.blueButton}
          onClick={handleClick}
          disabled={disabled}
        >
          <div className={`${disabled ? "blueButtonDisabled" : ""}`}>
            {children}
          </div>
          {text}
        </Button>
      )}
    </div>
  );
};
