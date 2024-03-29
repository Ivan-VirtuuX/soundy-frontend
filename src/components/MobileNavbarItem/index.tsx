import React from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { PostIcon } from "@/components/ui/Icons/PostIcon";
import { UserIcon } from "@/components/ui/Icons/UserIcon";
import { MessageIcon } from "@/components/ui/Icons/MessageIcon";
import { UsersIcon } from "@/components/ui/Icons/UsersIcon";
import { SearchIcon } from "@/components/ui/Icons/SearchIcon";
import { MusicIcon } from "@/components/ui/Icons/MusicIcon";
import { BlueButton } from "@/components/ui/BlueButton";

import { useMediaQuery } from "@mui/material";

import styles from "./MobileNavbarItem.module.scss";

interface NavbarItemProps {
  name: string;
  text: string;
}

export const MobileNavbarItem: React.FC<NavbarItemProps> = ({ name, text }) => {
  const router = useRouter();

  const matches768 = useMediaQuery("(max-width: 768px)");

  const iconsComponents = {
    posts: <PostIcon />,
    profile: <UserIcon />,
    conversations: <MessageIcon />,
    friends: <UsersIcon />,
    search: <SearchIcon />,
    music: <MusicIcon />,
  };

  const isHighlighted =
    router.asPath === "/" + name ||
    (name === "friends" && router.asPath === "/friend-requests") ||
    (name === "music" && router.asPath.includes("playlist")) ||
    (name === "conversations" && router.asPath.includes("conversations"))
      ? styles.activeLink
      : "";

  return (
    <li
      className={`${styles.link} ${
        name.includes("conversations") && styles.messagesIcon
      } ${isHighlighted}`}
    >
      <Link href={"/" + name}>
        <BlueButton variant="transparent" text={matches768 ? "" : text}>
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
