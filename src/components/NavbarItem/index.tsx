import React from "react";
import Link from "next/link";
import { PostIcon } from "@/components/ui/Icons/PostIcon";
import { useRouter } from "next/router";
import { UserIcon } from "@/components/ui/Icons/UserIcon";
import { MessageIcon } from "@/components/ui/Icons/MessageIcon";
import { UsersIcon } from "@/components/ui/Icons/UsersIcon";
import { SearchIcon } from "@/components/ui/Icons/SearchIcon";
import { MusicIcon } from "@/components/ui/Icons/MusicIcon";
import { BlueButton } from "@/components/ui/BlueButton";
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
    conversations: <MessageIcon />,
    friends: <UsersIcon />,
    search: <SearchIcon />,
    music: <MusicIcon />,
  };

  return (
    <li
      className={`${styles.link} ${
        name.includes("conversations") && styles.messagesIcon
      } ${
        router.asPath === "/" + name ||
        (name === "friends" && router.asPath === "/friend-requests") ||
        router.asPath.includes(name)
          ? styles.activeLink
          : styles.defaultLink
      }`}
    >
      <Link href={"/" + name}>
        <BlueButton variant="transparent" text={text}>
          {name.includes("users")
            ? iconsComponents["profile"]
            : name.includes("/conversations")
            ? iconsComponents["conversations"]
            : iconsComponents[name]}
        </BlueButton>
      </Link>
    </li>
  );
};
