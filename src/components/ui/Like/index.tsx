import React from "react";

import { IconButton } from "@mui/material";

import styles from "./Like.module.scss";

export const Like = ({
  likesCount,
  size,
  handleClickLike,
  handleClickDislike,
  isLiked,
  likeId,
}: {
  likesCount: number;
  size?: string;
  handleClickLike?: () => void;
  handleClickDislike?: (likeId: string) => void;
  isLiked?: boolean;
  likeId?: string;
}) => {
  const [liked, setLiked] = React.useState(false);

  React.useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const onDislike = () => {
    setLiked(false);

    handleClickDislike(likeId);
  };

  const onLike = () => {
    setLiked(true);

    handleClickLike();
  };

  return (
    <div>
      {liked ? (
        <div className={styles.likesBlock}>
          <IconButton
            size={size === "small" ? "small" : "large"}
            color="secondary"
            onClick={onDislike}
          >
            {size !== "small" ? (
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4264 0C12.5209 0 10.8927 1.35818 9.99818 2.29455C9.10364 1.35818 7.47909 0 5.57455 0C2.29182 0 0 2.28818 0 5.56364C0 9.17273 2.84636 11.5055 5.6 13.7618C6.9 14.8282 8.24545 15.93 9.27727 17.1518C9.45091 17.3564 9.70545 17.4745 9.97273 17.4745H10.0255C10.2936 17.4745 10.5473 17.3555 10.72 17.1518C11.7536 15.93 13.0982 14.8273 14.3991 13.7618C17.1518 11.5064 20 9.17364 20 5.56364C20 2.28818 17.7082 0 14.4264 0Z"
                  fill="#E8338B"
                />
              </svg>
            ) : (
              <svg
                style={{ padding: 5 }}
                width="14"
                height="14"
                viewBox="0 0 12 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.65582 0C7.51255 0 6.53564 0.854958 5.99891 1.44439C5.46218 0.854958 4.48745 0 3.34473 0C1.37509 0 0 1.44038 0 3.50224C0 5.77411 1.70782 7.24254 3.36 8.66289C4.14 9.33415 4.94727 10.0277 5.56636 10.7968C5.67055 10.9256 5.82327 11 5.98364 11H6.01527C6.17618 11 6.32836 10.925 6.432 10.7968C7.05218 10.0277 7.85891 9.33358 8.63945 8.66289C10.2911 7.24311 12 5.77469 12 3.50224C12 1.44038 10.6249 0 8.65582 0Z"
                  fill="#E8338B"
                />
              </svg>
            )}
          </IconButton>
          {likesCount && (
            <p className={`${liked ? styles.active : ""}`}>{likesCount}</p>
          )}
        </div>
      ) : (
        <div className={styles.likesBlock}>
          <IconButton
            size={size === "small" ? "small" : "large"}
            color="primary"
            onClick={onLike}
          >
            {size !== "small" ? (
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.45589 2.81259L9.99818 3.38022L10.5405 2.81259C11.4142 1.89809 12.8516 0.75 14.4264 0.75C15.8884 0.75 17.0849 1.25663 17.914 2.08429C18.743 2.91185 19.25 4.10547 19.25 5.56352C19.25 7.14995 18.6306 8.47503 17.6468 9.70112C16.6487 10.9452 15.3135 12.0427 13.9238 13.1814L13.9103 13.1924C12.6249 14.2451 11.2301 15.3874 10.148 16.6663C10.1161 16.704 10.0707 16.7242 10.0255 16.7242H9.97273C9.92681 16.7242 9.88092 16.7037 9.84904 16.6661L9.27736 17.1514L9.85028 16.6676C8.77887 15.3989 7.39679 14.2653 6.12197 13.2197L6.07565 13.1817L6.07535 13.1814C4.68522 12.0423 3.35023 10.9445 2.35245 9.70053C1.36906 8.47447 0.75 7.14958 0.75 5.56352C0.75 4.10548 1.25698 2.91188 2.08608 2.08432C2.91529 1.25666 4.11196 0.75 5.57455 0.75C7.14794 0.75 8.58162 1.89747 9.45589 2.81259Z"
                  stroke="#181F92"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg
                style={{ padding: 5 }}
                width="14"
                height="14"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.45589 2.81259L9.99818 3.38022L10.5405 2.81259C11.4142 1.89809 12.8516 0.75 14.4264 0.75C15.8884 0.75 17.0849 1.25663 17.914 2.08429C18.743 2.91185 19.25 4.10547 19.25 5.56352C19.25 7.14995 18.6306 8.47503 17.6468 9.70112C16.6487 10.9452 15.3135 12.0427 13.9238 13.1814L13.9103 13.1924C12.6249 14.2451 11.2301 15.3874 10.148 16.6663C10.1161 16.704 10.0707 16.7242 10.0255 16.7242H9.97273C9.92681 16.7242 9.88092 16.7037 9.84904 16.6661L9.27736 17.1514L9.85028 16.6676C8.77887 15.3989 7.39679 14.2653 6.12197 13.2197L6.07565 13.1817L6.07535 13.1814C4.68522 12.0423 3.35023 10.9445 2.35245 9.70053C1.36906 8.47447 0.75 7.14958 0.75 5.56352C0.75 4.10548 1.25698 2.91188 2.08608 2.08432C2.91529 1.25666 4.11196 0.75 5.57455 0.75C7.14794 0.75 8.58162 1.89747 9.45589 2.81259Z"
                  stroke="#181F92"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </IconButton>
          {likesCount && (
            <p className={`${liked ? styles.active : ""}`}>{likesCount}</p>
          )}
        </div>
      )}
    </div>
  );
};
