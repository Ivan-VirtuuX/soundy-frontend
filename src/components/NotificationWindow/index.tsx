import React from "react";

import styles from "./NotificationWindow.module.scss";
import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { IconButton } from "@mui/material";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";
import { truncateString } from "@/utils/truncateString";
import { IMessage } from "@/api/types";
import { useRouter } from "next/router";

interface NotificationWindowProps {
  notificationMessage: IMessage;
  handleCloseNotificationMessage: () => void;
}

export const NotificationWindow: React.FC<NotificationWindowProps> = ({
  notificationMessage,
  handleCloseNotificationMessage,
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
      handleCloseNotificationMessage();
    }, 100);
  };

  React.useEffect(() => {
    notificationMessage &&
      setTimeout(() => {
        notificationBlockRef?.current?.animate(moveDown, 1000);

        setTimeout(() => {
          handleCloseNotificationMessage();
        }, 900);
      }, 5000);
  }, [notificationMessage]);

  React.useEffect(() => {
    notificationMessage && notificationBlockRef?.current?.animate(moveUp, 100);
  }, [notificationMessage]);

  return (
    <div className={styles.notificationBlock} ref={notificationBlockRef}>
      <div className={styles.notificationBlockInner}>
        {notificationMessage?.sender?.avatarUrl ? (
          <img
            className={styles.notificationUserAvatar}
            src={notificationMessage.sender.avatarUrl}
            alt="user avatar"
            onClick={() =>
              router.push(
                `/conversations/${notificationMessage.conversationId}`
              )
            }
          />
        ) : (
          <EmptyAvatar width={50} />
        )}
        <div className={styles.notificationBlockRightSide}>
          <div className={styles.notificationBlockContent}>
            <span
              onClick={() =>
                router.push(
                  `/conversations/${notificationMessage.conversationId}`
                )
              }
            >
              {notificationMessage?.sender?.name}
            </span>
            <span
              onClick={() =>
                router.push(
                  `/conversations/${notificationMessage.conversationId}`
                )
              }
            >
              {notificationMessage?.sender?.surname}
            </span>
            <IconButton onClick={onCloseNotification}>
              <CrossIcon color="#898989" />
            </IconButton>
          </div>
          <p
            onClick={() =>
              router.push(
                `/conversations/${notificationMessage.conversationId}`
              )
            }
          >
            {truncateString(notificationMessage?.content.text, 15)}
          </p>
        </div>
      </div>
    </div>
  );
};
