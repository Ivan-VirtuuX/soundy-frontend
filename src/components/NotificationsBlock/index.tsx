import React from "react";

import { NotificationWindow } from "@/components/NotificationWindow";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { useNotifications } from "@/hooks/useNotifications";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import styles from "./NotificationsBlock.module.scss";

export const NotificationsBlock = () => {
  const userData = useAppSelector(selectUserData);

  const { notificationMessages, setNotificationMessages } = useNotifications(
    userData?.userId
  );

  const [parent] = useAutoAnimate();

  return (
    notificationMessages.length !== 0 && (
      <ul ref={parent} className={styles.notificationsBlock}>
        {notificationMessages.slice(0, 3).map((obj) => (
          <NotificationWindow
            key={obj.messageId}
            {...obj}
            bottomCoords={notificationMessages.indexOf(obj) * 100}
            handleCloseNotificationMessage={(messageId) =>
              setNotificationMessages((prev) => [
                ...prev.filter((msg) => msg.messageId !== messageId),
              ])
            }
          />
        ))}
      </ul>
    )
  );
};
