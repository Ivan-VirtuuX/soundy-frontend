import React from "react";
import styles from "./Navbar.module.scss";
import { NavbarItem } from "@/components/NavbarItem";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

export const Navbar: React.FC = () => {
  const userData = useAppSelector(selectUserData);

  const navItems = [
    { id: 1, text: "Посты", name: "posts" },
    { id: 2, text: "Профиль", name: `users/${userData?.id}` },
    { id: 3, text: "Сообщения", name: "messages" },
    { id: 4, text: "Друзья", name: "friends" },
    { id: 5, text: "Поиск", name: "search" },
    { id: 6, text: "Музыка", name: "music" },
  ];

  return (
    <ul className={styles.navbar}>
      {navItems.map((item) => (
        <NavbarItem {...item} key={item.id} />
      ))}
    </ul>
  );
};
