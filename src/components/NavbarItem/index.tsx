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

import styles from "./NavbarItem.module.scss";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

interface NavbarItemProps {
  name: string;
  text: string;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({ name, text }) => {
  const router = useRouter();

  const userData = useAppSelector(selectUserData);

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
        <BlueButton variant="transparent" text={text}>
          {name.includes("users")
            ? iconsComponents["profile"]
            : name.includes("/conversations")
            ? iconsComponents["conversations"]
            : iconsComponents[name]}
          {userData &&
            userData?.friendRequests.length !== 0 &&
            name === "friends" && (
              <div className={styles.friendRequestsCount}>
                +{userData?.friendRequests.length}
              </div>
            )}
        </BlueButton>
      </Link>
    </li>
  );
};
