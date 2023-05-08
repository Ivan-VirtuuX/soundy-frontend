import React from "react";

import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

import { destroyCookie } from "nookies";

import logoText from "@/public/images/logoText.svg";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUserData, setUserData } from "@/redux/slices/user";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { LogoutIcon } from "@/components/ui/Icons/LogoutIcon";

import { IconButton } from "@mui/material";

import styles from "./Header.module.scss";

export const Header = () => {
  const [isVisibleUserInfo, setIsVisibleUserInfo] = React.useState(true);

  const userData = useAppSelector(selectUserData);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const onLogout = async () => {
    setIsVisibleUserInfo(false);
    destroyCookie(null, "authToken", { path: "/" });

    await router.push("/");

    dispatch(setUserData(null));
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Link href="/posts">
          <Image
            className={styles.logo}
            src={logoText}
            alt="logo"
            quality={100}
          />
        </Link>
        {isVisibleUserInfo && (
          <div className={styles.userInfoBlock}>
            {userData?.avatarUrl ? (
              <Link href={`/users/${userData?.userId}`}>
                <img
                  className={styles.avatar}
                  src={userData?.avatarUrl}
                  alt="avatar"
                  width={40}
                  height={40}
                />
              </Link>
            ) : (
              <Link href={`/users/${userData?.userId}`}>
                <EmptyAvatar width={30} />
              </Link>
            )}
            <Link href={`/users/${userData?.userId}`}>
              <span className={styles.name}>{userData?.name}</span>
            </Link>
            <IconButton
              onClick={onLogout}
              size="small"
              className={styles.logoutButton}
              color="primary"
            >
              <LogoutIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};
