import React from "react";

import { NavbarItem } from "@/components/NavbarItem";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import styles from "./Navbar.module.scss";

export const Index: React.FC = () => {
  const userData = useAppSelector(selectUserData);

  const navItems = [
    { id: 1, text: "Посты", name: "posts" },
    { id: 2, text: "Профиль", name: `users/${userData?.userId}` },
    { id: 3, text: "Сообщения", name: "conversations" },
    { id: 4, text: "Друзья", name: "friends" },
    { id: 5, text: "Поиск", name: "search" },
    { id: 6, text: "Музыка", name: "music" },
  ];

  return (
    <ul className={styles.container}>
      {navItems.map((item) => (
        <NavbarItem {...item} key={item.id} />
      ))}
    </ul>
  );
};

export const Navbar = React.memo(Index);
