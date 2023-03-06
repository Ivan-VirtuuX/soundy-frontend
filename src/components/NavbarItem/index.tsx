import React from "react";
import Link from "next/link";
import { PostsLogo } from "@/components/UI/PostsLogo";
import { useRouter } from "next/router";
import { ProfileLogo } from "@/components/UI/ProfileLogo";
import { MessagesLogo } from "@/components/UI/MessagesLogo";
import { FriendsLogo } from "@/components/UI/FriendsLogo";
import { SearchLogo } from "@/components/UI/SearchLogo";
import { MusicLogo } from "@/components/UI/MusicLogo";
import { BlueButton } from "@/components/UI/BlueButton";
import styles from "./NavbarItem.module.scss";

interface NavbarItemProps {
  name: string;
  text: string;
}

export const NavbarItem: React.FC<NavbarItemProps> = ({ name, text }) => {
  const router = useRouter();

  const iconsComponents = {
    posts: <PostsLogo />,
    profile: <ProfileLogo />,
    messages: <MessagesLogo />,
    friends: <FriendsLogo />,
    search: <SearchLogo />,
    music: <MusicLogo />,
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
