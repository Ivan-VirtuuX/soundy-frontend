import React from "react";

import { Skeleton } from "@material-ui/lab";
import { useMediaQuery } from "@mui/material";

import styles from "./CommentItem.module.scss";

export const CommentItemSkeleton = () => {
  const match576 = useMediaQuery("(max-width: 576px)");

  return (
    <div className={styles.container}>
      <div>
        <Skeleton
          variant="circle"
          width={40}
          height={40}
          className={styles.avatar}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.head}>
          <div className={styles.infoBlock}>
            <div className={styles.nameSurnameBlock}>
              <Skeleton
                variant="text"
                className={styles.name}
                width={60}
                height={20}
                style={{ marginRight: 10 }}
              />
              <Skeleton
                variant="text"
                className={styles.surname}
                width={80}
                height={20}
                style={{ marginRight: 10 }}
              />
            </div>
            <Skeleton
              variant="text"
              className={styles.createdAt}
              width={100}
              height={20}
              style={{ marginRight: 10 }}
            />
          </div>
          <div className={styles.rightSide}>
            <Skeleton
              variant="circle"
              width={24}
              height={24}
              style={{ borderRadius: 50 }}
            />
          </div>
        </div>
        <Skeleton
          variant="text"
          className={styles.text}
          width={80}
          height={20}
          style={{ marginRight: 10, marginTop: match576 && 5 }}
        />
      </div>
    </div>
  );
};
