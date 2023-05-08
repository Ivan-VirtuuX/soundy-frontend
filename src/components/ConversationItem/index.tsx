import React from "react";

import Link from "next/link";

import { IConversation, IMessage } from "@/api/types";
import { Api } from "@/api";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { truncateString } from "@/utils/truncateString";
import { socket } from "@/utils/SocketContext";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { ImageIcon } from "@/components/ui/Icons/ImageIcon";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useMediaQuery } from "@mui/material";

import { useInterval } from "@/hooks/useInterval";

import { ConversationItemSkeleton } from "@/components/ConversationItem/ConversationItem.skeleton";

import { useLongPress } from "use-long-press";

import styles from "./ConversationItem.module.scss";

interface ConversationItemProps extends IConversation {
  handleDeleteConversation: (conversationId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  sender,
  receiver,
  conversationId,
  handleDeleteConversation,
  messages,
}) => {
  const [localMessages, setLocalMessages] =
    React.useState<IMessage[]>(messages);
  const [lastMessage, setLastMessage] = React.useState<IMessage>(
    messages[messages.length - 1]
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const userData = useAppSelector(selectUserData);

  const wrapperRef = React.useRef(null);

  const conversationUser =
    receiver?.userId === userData?.userId ? sender : receiver;

  const { convertedDate } = useInterval(5000, lastMessage?.createdAt);

  const match576 = useMediaQuery("(max-width: 576px)");

  const onShowMessageActions = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    setAnchorEl(wrapperRef.current);
  };

  const bind = useLongPress((e: React.MouseEvent<HTMLDivElement>) =>
    onShowMessageActions(e)
  );

  React.useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const messages = await Api().conversation.getMessages(conversationId);

        setLastMessage(messages[messages.length - 1]);

        setIsLoading(false);
      } catch (err) {
        console.warn(err);
        setIsLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        socket.on("onMessage", async ({ ...message }) => {
          if (
            message.sender.userId === receiver.userId ||
            message.sender.userId === sender.userId
          ) {
            setLastMessage(message);
            setLocalMessages([...localMessages, message]);
          }
        });
        socket.on("onDeleteMessage", async (messageId) => {
          const filteredMessages = [
            ...localMessages.filter((msg) => msg.messageId !== messageId),
          ];

          setLocalMessages(filteredMessages);

          setLastMessage(filteredMessages.at(-1));
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
  }, [socket, localMessages]);

  if (isLoading) {
    return <ConversationItemSkeleton />;
  }

  return (
    <div
      className={styles.wrapper}
      onContextMenu={onShowMessageActions}
      ref={wrapperRef}
      {...bind()}
    >
      <Link href={`/conversations/${conversationId}`}>
        <div className={styles.container}>
          <div className={styles.leftSide}>
            {conversationUser.avatarUrl ? (
              <div>
                <img
                  className={styles.avatar}
                  src={conversationUser.avatarUrl}
                  alt="avatar"
                />
              </div>
            ) : (
              <div>
                <EmptyAvatar width={50} className={styles.avatar} />
              </div>
            )}
            <div className={styles.leftSideText}>
              <div className={styles.receiverInfo}>
                <span>{conversationUser.name}</span>
                <span>{truncateString(conversationUser.surname, 10)}</span>
              </div>
              <p className={styles.lastMessageText}>
                {lastMessage?.sender.userId === userData?.userId &&
                lastMessage?.content.text
                  ? "Вы: " +
                    truncateString(
                      lastMessage?.content.text,
                      match576 ? 10 : 20
                    )
                  : truncateString(
                      lastMessage?.content.text,
                      match576 ? 10 : 20
                    )}
                {lastMessage?.sender.userId === userData?.userId &&
                  lastMessage?.content?.images[
                    lastMessage?.content?.images?.length - 1
                  ] && (
                    <div className={styles.imageMessageBlock}>
                      <span>Вы: Картинка</span>
                      <ImageIcon />
                    </div>
                  )}
              </p>
            </div>
          </div>
          <div className={styles.rightSide}>
            {lastMessage && lastMessage?.createdAt && (
              <span className={styles.lastMessageDate}>{convertedDate}</span>
            )}
          </div>
        </div>
      </Link>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        variant="menu"
      >
        <MenuItem onClick={() => handleDeleteConversation(conversationId)}>
          Удалить
        </MenuItem>
      </Menu>
    </div>
  );
};
