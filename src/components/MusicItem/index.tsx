import React from "react";
import styles from "./MusicItem.module.scss";

export const MusicItem: React.FC = ({}) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img className={styles.avatar} />|
        <div>
          <span className={styles.name}></span>
          <span className={styles.artist}></span>
        </div>
      </div>
      <div className={styles.rightSide}>
        <span>0:01</span>
        <span>0:42</span>
      </div>
    </div>
  );
};
