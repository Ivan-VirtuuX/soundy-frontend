import React from "react";
import styles from "./Navbar.module.scss";
import { NavbarItem } from "@/components/NavbarItem";

export const Navbar: React.FC = () => {
  const navItems = [
    { id: 1, text: "Посты", name: "posts" },
    { id: 2, text: "Профиль", name: "profile" },
    { id: 3, text: "Сообщения", name: "messages" },
    { id: 4, text: "Друзья", name: "friends" },
    { id: 5, text: "Поиск", name: "search" },
    { id: 6, text: "Музыка", name: "music" },
  ];

  return (
    <ul className={styles.navbar}>
      {navItems.map((item) => (
        <NavbarItem key={item.id} {...item} />
      ))}
    </ul>
  );
};
