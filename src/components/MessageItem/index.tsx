import React from "react";

import styles from "./MessageItem.module.scss";

export const MessageItem = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <p className={styles.text}>message text</p>
        <span className={styles.date}>
          {new Date().toLocaleTimeString("ru-Ru", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className={styles.svgAppendix}>
        <svg width="9" height="20" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <path
              d="M3 17h6V0c-.193 2.84-.876 5.767-2.05 8.782-.904 2.325-2.446 4.485-4.625 6.48A1 1 0 003 17z"
              fill="#f6f6f6"
              className="corner"
            ></path>
          </g>
        </svg>
      </div>
    </div>
  );
};
