import React from "react";
import Image from "next/image";
import { IConversation, IMessage, IUser } from "@/api/types";
import styles from "./ConversationItem.module.scss";

interface ConversationItemProps extends IConversation {
  messages: IMessage[];
  sender: IUser;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  sender,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <Image
          className={styles.avatar}
          quality={100}
          src={sender.avatarUrl}
          alt="avatar"
          width={50}
          height={50}
        />
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
