import React from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { destroyCookie } from "nookies";

import logoText from "@/public/images/logoText.svg";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUserData, setUserData } from "@/redux/slices/user";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { LogoutIcon } from "@/components/ui/Icons/LogoutIcon";

import { truncateString } from "@/utils/truncateString";

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
        <Image
          className={styles.logo}
          src={logoText}
          alt="logo"
          quality={100}
          onClick={() => router.push("/posts")}
        />
        {isVisibleUserInfo && (
          <div className={styles.userInfoBlock}>
            {userData?.avatarUrl ? (
              <img
                className={styles.avatar}
                src={userData?.avatarUrl}
                alt="avatar"
                width={40}
                height={40}
                onClick={() => router.push(`/users/${userData?.id}`)}
              />
            ) : (
              <EmptyAvatar
                width={30}
                handleClick={() => router.push(`/users/${userData?.id}`)}
              />
            )}
            <div onClick={() => router.push(`/users/${userData?.id}`)}>
              <span className={styles.name}>{userData?.name}</span>
              <span className={styles.surname}>
                {truncateString(userData?.surname, 10)}
              </span>
            </div>
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
