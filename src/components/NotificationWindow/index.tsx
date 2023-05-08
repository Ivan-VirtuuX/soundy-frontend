import React from "react";
import Link from "next/link";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";

import { IconButton } from "@mui/material";

import { truncateString } from "@/utils/truncateString";

import { IMessage } from "@/api/types";

import styles from "./NotificationWindow.module.scss";

interface NotificationWindowProps extends IMessage {
  handleCloseNotificationMessage: (messageId: string) => void;
  bottomCoords: number;
}

export const NotificationWindow: React.FC<NotificationWindowProps> = ({
  handleCloseNotificationMessage,
  messageId,
  content,
  sender,
  conversationId,
  bottomCoords,
}) => {
  const notificationBlockRef = React.useRef(null);

  const onCloseNotification = () => {
    setTimeout(() => {
      handleCloseNotificationMessage(messageId);
    }, 100);
  };

  React.useEffect(() => {
    content &&
      setTimeout(() => {
        handleCloseNotificationMessage(messageId);
      }, 5000);
  }, [content]);

  return (
    <li
      className={styles.notificationBlock}
      ref={notificationBlockRef}
      style={{ bottom: bottomCoords ? bottomCoords : 0 }}
    >
      <div className={styles.notificationBlockInner}>
        {sender?.avatarUrl ? (
          <Link href={`/conversations/${conversationId}`}>
            <img
              className={styles.notificationUserAvatar}
              src={sender.avatarUrl}
              alt="user avatar"
            />
          </Link>
        ) : (
          <Link href={`/conversations/${conversationId}`}>
            <EmptyAvatar width={50} />
          </Link>
        )}
        <div className={styles.notificationBlockRightSide}>
          <div className={styles.notificationBlockContent}>
            <Link href={`/conversations/${conversationId}`}>
              <span>{sender?.name}</span>
              <span>{sender?.surname}</span>
            </Link>
            <IconButton onClick={onCloseNotification}>
              <CrossIcon color="#898989" />
            </IconButton>
          </div>
          <Link href={`/conversations/${conversationId}`}>
            <p>{truncateString(content.text, 15)}</p>
          </Link>
        </div>
      </div>
    </li>
  );
};
