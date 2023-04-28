import React from "react";

import { useRouter } from "next/router";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { BlueButton } from "@/components/ui/BlueButton";
import { KebabMenu } from "@/components/ui/KebabMenu";
import { PlusIcon } from "@/components/ui/Icons/PlusIcon";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";
import { MessageIcon } from "@/components/ui/Icons/MessageIcon";
import { CheckMarkIcon } from "@/components/ui/Icons/CheckMarkIcon";

import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import { Api } from "@/api";

import styles from "./UserItem.module.scss";
import { truncateString } from "@/utils/truncateString";

interface UserItemProps {
  userId: string;
  avatarUrl: string;
  name: string;
  surname: string;
  login: string;
  handleDelete?: (userId: string) => void;
  type?: string;
  handleAccept?: (userId: string) => void;
  handleCancel?: (userId: string) => void;
  isConfirmed?: boolean;
  isCancelled?: boolean;
  menuHidden?: boolean;
}

export const UserItem: React.FC<UserItemProps> = ({
  avatarUrl,
  name,
  surname,
  userId,
  login,
  handleDelete,
  type,
  handleAccept,
  handleCancel,
  isConfirmed,
  isCancelled,
  menuHidden,
}) => {
  const [isLoadingConversation, setIsLoadingConversation] =
    React.useState(false);

  const router = useRouter();

  const friendItemRef = React.useRef(null);

  const { isVisible, onMouseOver, onMouseLeave } =
    useTransitionOpacity(friendItemRef);

  const createConversation = async () => {
    try {
      setIsLoadingConversation(true);

      const data = await Api().conversation.createConversation({
        receiver: userId,
      });

      await router.push(`/conversations/${data.conversationId}`);

      setIsLoadingConversation(false);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  return (
    <div
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      className={styles.container}
      style={{
        marginTop: type === "requestFriends" && 20,
      }}
    >
      <div className={styles.leftSide}>
        {avatarUrl ? (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt="avatar"
            onClick={() => router.push(`/users/${userId}`)}
          />
        ) : (
          <EmptyAvatar
            className={styles.avatar}
            width={80}
            handleClick={() => router.push(`/users/${userId}`)}
          />
        )}
        <div className={styles.userInfoBlock}>
          <div
            className={styles.nameSurnameBlock}
            onClick={() => router.push(`/users/${userId}`)}
          >
            <span className={styles.name}>{name}</span>
            <span className={styles.surname}>
              {truncateString(surname, 10)}
            </span>
          </div>
          <span
            className={styles.login}
            onClick={() => router.push(`/users/${userId}`)}
          >
            {login}
          </span>
          {type === "requestFriends" ? (
            <div className={styles.requestFriendActionsBlock}>
              {!isConfirmed && (
                <BlueButton
                  handleClick={() => handleAccept(userId)}
                  size="sm"
                  text="Принять"
                  color="primary"
                >
                  <PlusIcon />
                </BlueButton>
              )}
              {isCancelled ? (
                <BlueButton disabled size="sm" text="Отклонена" color="primary">
                  <CheckMarkIcon />
                </BlueButton>
              ) : (
                <BlueButton
                  handleClick={() => handleCancel(userId)}
                  size="sm"
                  text="Отклонить"
                  color="primary"
                >
                  <CrossIcon />
                </BlueButton>
              )}
            </div>
          ) : (
            <BlueButton
              size="sm"
              text="Сообщение"
              color="primary"
              handleClick={createConversation}
              disabled={isLoadingConversation}
            >
              <MessageIcon width={18} height={18} color="white" />
            </BlueButton>
          )}
        </div>
      </div>
      {isVisible && type !== "requestFriends" && !menuHidden && (
        <KebabMenu
          innerRef={friendItemRef}
          handleDelete={() => handleDelete(userId)}
        />
      )}
    </div>
  );
};
