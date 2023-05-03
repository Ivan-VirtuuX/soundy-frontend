import { IconButton } from "@mui/material";

import styles from "./Comment.module.scss";

export const Comment = ({
  commentsCount,
  handleClick,
}: {
  commentsCount: number;
  handleClick: () => void;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.commentsBlock}>
        <IconButton size="large" color="success" onClick={handleClick}>
          <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 6C17.7956 6 18.5587 6.31607 19.1213 6.87868C19.6839 7.44129 20 8.20435 20 9V12C20 12.7956 19.6839 13.5587 19.1213 14.1213C18.5587 14.6839 17.7956 15 17 15V15.966C17 17.026 15.764 17.605 14.95 16.926L12.638 15H10C9.20435 15 8.44129 14.6839 7.87868 14.1213C7.31607 13.5587 7 12.7956 7 12V9C7 8.20435 7.31607 7.44129 7.87868 6.87868C8.44129 6.31607 9.20435 6 10 6H17ZM14 0C14.7956 0 15.5587 0.316071 16.1213 0.87868C16.6839 1.44129 17 2.20435 17 3V4H9C7.93913 4 6.92172 4.42143 6.17157 5.17157C5.42143 5.92172 5 6.93913 5 8V12C5 13.044 5.4 13.996 6.056 14.708L5 15.5C4.176 16.118 3 15.53 3 14.5V13C2.20435 13 1.44129 12.6839 0.87868 12.1213C0.316071 11.5587 0 10.7956 0 10V3C0 2.20435 0.316071 1.44129 0.87868 0.87868C1.44129 0.316071 2.20435 0 3 0H14Z"
              fill="#7DCF3C"
            />
          </svg>
        </IconButton>
        {commentsCount !== 0 && <p>{commentsCount}</p>}
      </div>
    </div>
  );
};
