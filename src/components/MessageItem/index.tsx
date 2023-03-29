import React from "react";

import styles from "./MessageItem.module.scss";
import { IMessage } from "@/api/types";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Api } from "@/api/index";

interface MessageItemProps extends IMessage {
  innerRef: React.Ref<HTMLDivElement>;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  sender,
  content,
  createdAt,
  innerRef,
  messageId,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const userData = useAppSelector(selectUserData);

  const onShowMessageActions = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    setAnchorEl(e.currentTarget);
  };

  const onHideMessageActions = () => {
    setAnchorEl(null);
  };

  const onDeleteMessage = async () => {
    try {
      await Api().message.deleteMessage(messageId);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={onHideMessageActions}
      >
        <MenuItem onClick={onDeleteMessage}>Удалить</MenuItem>
      </Menu>
      {sender?.id === userData.id || sender?.userId === userData.id ? (
        <div
          onContextMenu={onShowMessageActions}
          className={styles.containerRightSide}
          ref={innerRef}
          style={{ padding: content.imageUrl ? "0 0 10px 0" : 10 }}
        >
          <div className={styles.contentRightSide}>
            <div className={styles.inner}>
              {content.imageUrl && (
                <img
                  className={styles.messageImage}
                  src={content.imageUrl}
                  alt="comment image"
                />
              )}
              {content.text && (
                <p
                  className={styles.text}
                  style={{ marginLeft: content.imageUrl ? 10 : 0 }}
                >
                  {content.text}
                </p>
              )}
            </div>
            <p
              className={styles.date}
              style={{ marginRight: content.imageUrl ? 10 : 0 }}
            >
              {/*{new Date(createdAt).toLocaleTimeString("ru-Ru", {*/}
              {/*  hour: "2-digit",*/}
              {/*  minute: "2-digit",*/}
              {/*})}*/}
            </p>
          </div>
          <div className={styles.svgAppendixRightSide}>
            <svg
              width="9"
              height="20"
              viewBox="0 0 9 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_553_1641)">
                <path
                  d="M5.9998 17H-0.000199795V0C0.1928 2.84 0.8758 5.767 2.0498 8.782C2.9538 11.107 4.4958 13.267 6.6748 15.262C6.82359 15.398 6.92778 15.5759 6.97371 15.7722C7.01963 15.9685 7.00515 16.1741 6.93217 16.362C6.85918 16.55 6.73109 16.7114 6.5647 16.8253C6.39832 16.9391 6.20141 17 5.9998 17Z"
                  fill="#F6F6F6"
                />
              </g>
              <defs>
                <clipPath id="clip0_553_1641">
                  <rect
                    width="9"
                    height="20"
                    fill="white"
                    transform="matrix(-1 0 0 1 9 0)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      ) : (
        <div
          className={styles.containerLeftSide}
          ref={innerRef}
          style={{ padding: content.imageUrl ? "0 0 10px 0" : 10 }}
        >
          <div className={styles.contentLeftSide}>
            <div className={styles.inner}>
              {content.imageUrl && (
                <img
                  className={styles.messageImage}
                  src={content.imageUrl}
                  alt="comment image"
                />
              )}
              {content.text && (
                <p
                  className={styles.text}
                  style={{ marginLeft: content.imageUrl ? 10 : 0 }}
                >
                  {content.text}
                </p>
              )}
            </div>
            <p
              className={styles.dateLeftSide}
              style={{ marginLeft: content.imageUrl ? 10 : 0 }}
            >
              {/*{new Date(createdAt).toLocaleTimeString("ru-Ru", {*/}
              {/*  hour: "2-digit",*/}
              {/*  minute: "2-digit",*/}
              {/*})}*/}
            </p>
          </div>
          <div className={styles.svgAppendixLeftSide}>
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
      )}
    </>
  );
};
