import React, { Ref } from "react";

import { useRouter } from "next/router";

import { EmptyAvatar } from "@/components/UI/EmptyAvatar";
import { BlueButton } from "@/components/UI/BlueButton";
import { KebabMenu } from "@/components/UI/KebabMenu";
import { PlusIcon } from "@/components/UI/Icons/PlusIcon";
import { CrossIcon } from "@/components/UI/Icons/CrossIcon";

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
  innerRef: Ref<HTMLDivElement>;
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
      style={{ marginTop: type === "requestFriends" && 20 }}
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
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.02998 6.71147L9.0831 1.65835C9.27217 1.46929 9.51279 1.37476 9.80498 1.37476C10.0972 1.37476 10.3378 1.46929 10.5269 1.65835C10.7159 1.84741 10.8104 2.08804 10.8104 2.38022C10.8104 2.67241 10.7159 2.91304 10.5269 3.1021L4.75186 8.8771C4.54561 9.08335 4.30498 9.18647 4.02998 9.18647C3.75498 9.18647 3.51436 9.08335 3.30811 8.8771L0.626855 6.19585C0.437793 6.00679 0.343262 5.76616 0.343262 5.47397C0.343262 5.18179 0.437793 4.94116 0.626855 4.7521C0.815918 4.56304 1.05654 4.46851 1.34873 4.46851C1.64092 4.46851 1.88154 4.56304 2.07061 4.7521L4.02998 6.71147Z"
                      fill="#898989"
                    />
                  </svg>
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.97367 7.94595V7.95297M6.16286 7.94595V7.95297M11.7845 7.94595V7.95297M3.35205 14.973V5.83784C3.35205 5.27874 3.57415 4.74253 3.9695 4.34718C4.36485 3.95184 4.90105 3.72973 5.46016 3.72973H12.4872C13.0463 3.72973 13.5825 3.95184 13.9778 4.34718C14.3732 4.74253 14.5953 5.27874 14.5953 5.83784V10.0541C14.5953 10.6132 14.3732 11.1494 13.9778 11.5447C13.5825 11.9401 13.0463 12.1622 12.4872 12.1622H6.16286L3.35205 14.973Z"
                  stroke="white"
                  strokeWidth="1.40541"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
