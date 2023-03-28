import React from "react";
import { IConversation, IUser } from "@/api/types";
import styles from "./ConversationItem.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";
import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { useRouter } from "next/router";

interface ConversationItemProps extends IConversation {
  sender: IUser;
  receiver: IUser;
  conversationId: string;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  sender,
  receiver,
  conversationId,
}) => {
  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  return (
    <div
      className={styles.container}
      onClick={() => router.push(`/conversations/${conversationId}`)}
    >
      <div className={styles.leftSide}>
        {sender.avatarUrl && sender?.userId === userData?.id ? (
          <img className={styles.avatar} src={sender.avatarUrl} alt="avatar" />
        ) : receiver.avatarUrl && receiver?.userId === userData?.id ? (
          <img
            className={styles.avatar}
            src={receiver.avatarUrl}
            alt="avatar"
          />
        ) : (
          <EmptyAvatar width={50} />
        )}
        <div className={styles.leftSideText}>
          <div className={styles.receiverInfo}>
            <span>{sender.name}</span>
            <span>{sender.surname}</span>
          </div>
          <p className={styles.lastMessageText}>last message text</p>
        </div>
      </div>
      <span className={styles.lastMessageDate}>15.04.2023</span>
    </div>
  );
};
