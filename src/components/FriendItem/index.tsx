import React from "react";

import { useRouter } from "next/router";

import { EmptyAvatar } from "@/components/UI/EmptyAvatar";

import styles from "./FriendItem.module.scss";
import { BlueButton } from "@/components/UI/BlueButton";
import { KebabMenu } from "@/components/UI/KebabMenu";

interface FriendItemProps {
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

export const FriendItem: React.FC<FriendItemProps> = ({
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
  const router = useRouter();

  return (
    <div
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
              {isConfirmed ? (
                <BlueButton
                  disabled
                  handleClick={() => handleAccept(userId)}
                  size="sm"
                  text="Принята"
                  color="primary"
                >
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
                !isCancelled && (
                  <BlueButton
                    handleClick={() => handleAccept(userId)}
                    size="sm"
                    text="Принять"
                    color="primary"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.7685 7.62152H8.20648V12.1836C8.20648 12.4255 8.11035 12.6576 7.93924 12.8287C7.76813 12.9998 7.53606 13.096 7.29407 13.096C7.05209 13.096 6.82001 12.9998 6.6489 12.8287C6.4778 12.6576 6.38167 12.4255 6.38167 12.1836V7.62152H1.81963C1.57765 7.62152 1.34557 7.52539 1.17446 7.35428C1.00336 7.18317 0.907227 6.9511 0.907227 6.70911C0.907227 6.46713 1.00336 6.23505 1.17446 6.06394C1.34557 5.89283 1.57765 5.79671 1.81963 5.79671H6.38167V1.23467C6.38167 0.992687 6.4778 0.760613 6.6489 0.589503C6.82001 0.418394 7.05209 0.322266 7.29407 0.322266C7.53606 0.322266 7.76813 0.418394 7.93924 0.589503C8.11035 0.760613 8.20648 0.992687 8.20648 1.23467V5.79671H12.7685C13.0105 5.79671 13.2426 5.89283 13.4137 6.06394C13.5848 6.23505 13.6809 6.46713 13.6809 6.70911C13.6809 6.9511 13.5848 7.18317 13.4137 7.35428C13.2426 7.52539 13.0105 7.62152 12.7685 7.62152Z"
                        fill="white"
                      />
                    </svg>
                  </BlueButton>
                )
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
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.81027 2.48338L6.58442 5.70923L9.81027 8.93507C9.98138 9.10618 10.0775 9.33826 10.0775 9.58024C10.0775 9.82223 9.98138 10.0543 9.81027 10.2254C9.63916 10.3965 9.40708 10.4926 9.1651 10.4926C8.92311 10.4926 8.69104 10.3965 8.51993 10.2254L5.29408 6.99957L2.06824 10.2254C1.89713 10.3965 1.66506 10.4926 1.42307 10.4926C1.18109 10.4926 0.949011 10.3965 0.777902 10.2254C0.606792 10.0543 0.510664 9.82223 0.510664 9.58024C0.510664 9.33826 0.606792 9.10618 0.777902 8.93507L4.00375 5.70923L0.777902 2.48338C0.606792 2.31227 0.510664 2.0802 0.510664 1.83821C0.510664 1.59623 0.606792 1.36416 0.777902 1.19305C0.949011 1.02194 1.18109 0.925808 1.42307 0.925808C1.66506 0.925808 1.89713 1.02194 2.06824 1.19305L5.29408 4.41889L8.51993 1.19305C8.69104 1.02194 8.92311 0.925808 9.1651 0.925808C9.40708 0.925808 9.63916 1.02194 9.81027 1.19305C9.98138 1.36416 10.0775 1.59623 10.0775 1.83821C10.0775 2.0802 9.98138 2.31227 9.81027 2.48338Z"
                      fill="white"
                    />
                  </svg>
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
