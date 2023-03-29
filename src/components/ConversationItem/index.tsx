import React from "react";
import { IConversation, IMessage, IUser } from "@/api/types";
import styles from "./ConversationItem.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";
import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { useRouter } from "next/router";
import { Api } from "@/api/index";
import { truncateString } from "@/utils/truncateString";
import { ImageIcon } from "@/components/ui/ImageIcon";

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
  const [lastMessage, setLastMessage] = React.useState<IMessage>(null);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  const conversationUser =
    receiver?.userId === userData?.id ? sender : receiver;

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().conversation.getMessages(conversationId);

        setLastMessage(data[data.length - 1]);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  return (
    <div
      className={styles.container}
      onClick={() => router.push(`/conversations/${conversationId}`)}
    >
      <div className={styles.leftSide}>
        {receiver.userId === userData.id && sender.avatarUrl ? (
          <img className={styles.avatar} src={sender.avatarUrl} alt="avatar" />
        ) : sender.userId === userData.id ? (
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
            <span>{conversationUser.name}</span>
            <span>{conversationUser.surname}</span>
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
      <span className={styles.lastMessageDate}>
        {new Date(lastMessage?.createdAt)?.toLocaleDateString()}
      </span>
    </div>
  );
};
