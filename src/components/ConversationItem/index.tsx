import React from "react";

import { useRouter } from "next/router";

import { IConversation, IMessage, IUser } from "@/api/types";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import { truncateString } from "@/utils/truncateString";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { ImageIcon } from "@/components/ui/Icons/ImageIcon";
import { KebabMenu } from "@/components/ui/KebabMenu";

import { socket } from "@/utils/SocketContext";

import styles from "./ConversationItem.module.scss";
import { Api } from "@/api/index";

interface ConversationItemProps extends IConversation {
  sender: IUser;
  receiver: IUser;
  conversationId: string;
  handleDeleteConversation: (conversationId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  sender,
  receiver,
  conversationId,
  handleDeleteConversation,
}) => {
  const [lastMessage, setLastMessage] = React.useState<IMessage>(null);

  const kebabMenuRef = React.useRef(null);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  const conversationUser =
    receiver?.userId === userData?.id ? sender : receiver;

  const { isActionsVisible, onMouseOver, onMouseLeave } =
    useTransitionOpacity(kebabMenuRef);

  React.useEffect(() => {
    (async () => {
      try {
        const messages = await Api().conversation.getMessages(conversationId);

        setLastMessage(messages[messages.length - 1]);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        socket.on("onMessage", async (payload) => {
          const { ...message } = payload;

          setLastMessage(message);
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

  return (
    <div
      className={styles.container}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={styles.leftSide}
        onClick={() => router.push(`/conversations/${conversationId}`)}
      >
        {conversationUser.avatarUrl ? (
          <img
            className={styles.avatar}
            src={conversationUser.avatarUrl}
            alt="avatar"
          />
        ) : (
          <EmptyAvatar width={50} />
        )}
        <div className={styles.leftSideText}>
          <div className={styles.receiverInfo}>
            <span>{conversationUser.name}</span>
            <span>{truncateString(conversationUser.surname, 10)}</span>
          </div>
          <p className={styles.lastMessageText}>
            {lastMessage?.sender.userId === userData?.id &&
            lastMessage?.content.text
              ? "Вы: " + truncateString(lastMessage?.content.text, 20)
              : truncateString(lastMessage?.content.text, 20)}
            {lastMessage?.sender &&
              userData?.id &&
              lastMessage?.content.imageUrl && (
                <div className={styles.imageMessageBlock}>
                  <span>Вы: Картинка</span>
                  <ImageIcon />
                </div>
              )}
          </p>
        </div>
      </div>
      <div className={styles.rightSide}>
        {isActionsVisible && (
          <KebabMenu
            handleDelete={() => handleDeleteConversation(conversationId)}
            innerRef={kebabMenuRef}
          />
        )}
        {lastMessage?.createdAt && (
          <span className={styles.lastMessageDate}>
            {new Date(lastMessage?.createdAt)?.toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};
