import React, { Ref } from "react";

import { useRouter } from "next/router";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { BlueButton } from "@/components/ui/BlueButton";
import { KebabMenu } from "@/components/ui/KebabMenu";
import { PlusIcon } from "@/components/ui/Icons/PlusIcon";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";
import { MessageIcon } from "@/components/ui/Icons/MessageIcon";
import { CheckMarkIcon } from "@/components/ui/Icons/CheckMarkIcon";

import styles from "./UserItem.module.scss";

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
  innerRef?: Ref<HTMLDivElement>;
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
  innerRef,
}) => {
  const router = useRouter();

  return (
    <div
      ref={innerRef}
      className={styles.container}
      style={{
        marginTop: type === "requestFriends" && 20,
        width: type === "friends" ? 350 : 300,
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
            <span className={styles.surname}>{surname}</span>
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
            <BlueButton size="sm" text="Сообщение" color="primary">
              <MessageIcon width={18} height={18} color="white" />
            </BlueButton>
          )}
        </div>
      </div>
      {type !== "requestFriends" && !menuHidden && (
        <KebabMenu handleDelete={() => handleDelete(userId)} />
      )}
    </div>
  );
};
