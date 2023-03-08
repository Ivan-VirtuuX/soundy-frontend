import React from "react";
import Link from "next/link";
import { PostIcon } from "@/components/UI/Icons/PostIcon";
import { useRouter } from "next/router";
import { UserIcon } from "@/components/UI/Icons/UserIcon";
import { MessageIcon } from "@/components/UI/Icons/MessageIcon";
import { UsersIcon } from "@/components/UI/Icons/UsersIcon";
import { SearchIcon } from "@/components/UI/Icons/SearchIcon";
import { MusicIcon } from "@/components/UI/Icons/MusicIcon";
import { BlueButton } from "@/components/UI/BlueButton";
import styles from "./NavbarItem.module.scss";

interface NavbarItemProps {
  name: string;
  text: string;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({ name, text }) => {
  const router = useRouter();

  const iconsComponents = {
    posts: <PostIcon />,
    profile: <UserIcon />,
    messages: <MessageIcon />,
    friends: <UsersIcon />,
    search: <SearchIcon />,
    music: <MusicIcon />,
  };

  return (
    <li
      className={`${styles.link} ${
        name === "messages" && styles.messagesIcon
      } ${
        router.asPath === "/" + name ||
        (name === "friends" && router.asPath === "/friend-requests")
          ? styles.activeLink
          : styles.defaultLink
      }`}
    >
      <Link href={"/" + name}>
        <BlueButton variant="transparent" text={text}>
          {name.includes("users")
            ? iconsComponents["profile"]
            : iconsComponents[name]}
        </BlueButton>
      </Link>
    </li>
  );
};
