import React from "react";

import Link from "next/link";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";

import { IUser } from "@/api/types";

import styles from "./FriendsList.module.scss";

export const FriendsList = ({ friends }: { friends: IUser[] }) => {
  return (
    <ul className={styles.container}>
      {friends.slice(0, 6).map((friend) => (
        <li className={styles.friend} key={friend.userId}>
          {friend?.avatarUrl ? (
            <Link href={`/users/${friend?.userId}`}>
              <img
                className={styles.avatar}
                src={friend?.avatarUrl}
                alt="avatar"
              />
            </Link>
          ) : (
            <Link href={`/users/${friend?.userId}`}>
              <EmptyAvatar width={40} />
            </Link>
          )}
          <span>{friend.name}</span>
        </li>
      ))}
    </ul>
  );
};
