import React from "react";

import { useRouter } from "next/router";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";

import styles from "./FriendsList.module.scss";

import { IUser } from "@/api/types";

export const FriendsList = ({ friends }: { friends: IUser[] }) => {
  const router = useRouter();

  return (
    <ul className={styles.container}>
      {friends.slice(0, 6).map((friend) => (
        <li className={styles.friend} key={friend.userId}>
          {friend?.avatarUrl ? (
            <img
              className={styles.avatar}
              src={friend?.avatarUrl}
              alt="avatar"
              onClick={() => router.push(`/users/${friend?.userId}`)}
            />
          ) : (
            <EmptyAvatar
              width={40}
              handleClick={() => router.push(`/users/${friend?.userId}`)}
            />
          )}
          <span>{friend.name}</span>
        </li>
      ))}
    </ul>
  );
};
