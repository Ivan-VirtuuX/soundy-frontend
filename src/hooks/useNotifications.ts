import React from "react";

import { IMessage } from "@/api/types";
import { Api } from "@/api/index";

import { socket } from "@/utils/SocketContext";

export const useNotifications = (userId: string | string[]) => {
  const [notificationMessage, setNotificationMessage] =
    React.useState<IMessage>(null);

  React.useEffect(() => {
    (async () => {
      try {
        socket.on("onMessage", async ({ ...message }) => {
          const data = await Api().conversation.getOne(message.conversationId);

          if (
            data.receiver?.userId === userId ||
            data.sender?.userId === userId
          ) {
            setNotificationMessage(message);
          }
        });
      } catch (err) {
        console.warn(err);
      }
    })();

    return () => {
      socket.off("onMessage");
      socket.off("onDeleteMessage");
      socket.off("message");
    };
  }, [socket]);

  return { notificationMessage, setNotificationMessage };
};
