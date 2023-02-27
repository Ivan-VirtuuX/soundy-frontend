import { EmptyAvatar } from "@/components/UI/EmptyAvatar";

import styles from "./FriendsList.module.scss";

export const FriendsList = () => {
  const friends = [
    { id: 1, name: "Name" },
    { id: 1, name: "Name" },
    { id: 1, name: "Name" },
    { id: 1, name: "Name" },
    { id: 1, name: "Name" },
    { id: 1, name: "Name" },
  ];
  return (
    <ul className={styles.container}>
      {friends.map((friend) => (
        <li className={styles.friend} key={friend.id}>
          <EmptyAvatar />
          <span>{friend.name}</span>
        </li>
      ))}
    </ul>
  );
};
