import React from "react";

import { Skeleton } from "@material-ui/lab";

import styles from "./ConversationItem.module.scss";

export const ConversationItemSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <div>
            <Skeleton
              variant="circle"
              width={50}
              height={50}
              style={{ borderRadius: 50 }}
            />
          </div>
          <div className={styles.receiverInfo}>
            <Skeleton
              variant="text"
              width={80}
              height={20}
              className={styles.skeletonUsername}
              style={{ marginRight: 10 }}
            />
            <Skeleton
              variant="text"
              width={80}
              height={20}
              className={styles.skeletonUsername}
            />
          </div>
        </div>
        <Skeleton
          variant="text"
          width={60}
          height={20}
          className={styles.skeletonMessageText}
        />
      </div>
    </div>
  );
};
