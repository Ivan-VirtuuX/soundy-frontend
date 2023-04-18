import React from "react";

import { useRouter } from "next/router";

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

  const router = useRouter();

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
          <img
            className={styles.notificationUserAvatar}
            src={sender.avatarUrl}
            alt="user avatar"
            onClick={() => router.push(`/conversations/${conversationId}`)}
          />
        ) : (
          <EmptyAvatar width={50} />
        )}
        <div className={styles.notificationBlockRightSide}>
          <div className={styles.notificationBlockContent}>
            <span
              onClick={() => router.push(`/conversations/${conversationId}`)}
            >
              {sender?.name}
            </span>
            <span
              onClick={() => router.push(`/conversations/${conversationId}`)}
            >
              {sender?.surname}
            </span>
            <IconButton onClick={onCloseNotification}>
              <CrossIcon color="#898989" />
            </IconButton>
          </div>
          <p onClick={() => router.push(`/conversations/${conversationId}`)}>
            {truncateString(content.text, 15)}
          </p>
        </div>
      </div>
    </li>
  );
};
