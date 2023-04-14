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
}

export const NotificationWindow: React.FC<NotificationWindowProps> = ({
  handleCloseNotificationMessage,
  messageId,
  content,
  sender,
  conversationId,
}) => {
  const notificationBlockRef = React.useRef(null);

  const router = useRouter();

  const moveUp = [
    {
      opacity: 0,
      transition: "opacity 0.5s ease-in-out",
    },
    {
      opacity: 100,
      transition: "opacity 0.5s ease-in-out",
    },
  ];

  const moveDown = [
    {
      opacity: 100,
      transition: "opacity 0.5s ease-in-out",
    },
    {
      opacity: 0,
      transition: "opacity 0.5s ease-in-out",
    },
  ];

  const onCloseNotification = () => {
    notificationBlockRef?.current?.animate(moveDown, 100);

    setTimeout(() => {
      handleCloseNotificationMessage(messageId);
    }, 100);
  };

  React.useEffect(() => {
    content &&
      setTimeout(() => {
        notificationBlockRef?.current?.animate(moveDown, 1000);

        setTimeout(() => {
          handleCloseNotificationMessage(messageId);
        }, 900);
      }, 5000);
  }, [content]);

  React.useEffect(() => {
    content && notificationBlockRef?.current?.animate(moveUp, 100);
  }, [content]);

  return (
    <div className={styles.notificationBlock} ref={notificationBlockRef}>
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
    </div>
  );
};
