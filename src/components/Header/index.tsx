import Image from "next/image";
import { useRouter } from "next/router";

import logoText from "@/public/images/logoText.svg";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectUserData, setUserData } from "@/redux/slices/user";

import { destroyCookie } from "nookies";

import styles from "./Header.module.scss";
import { EmptyAvatar } from "@/components/UI/EmptyAvatar";
import React from "react";

export const Header = () => {
  const [isVisibleUserInfo, setIsVisibleUserInfo] = React.useState(true);

  const userData = useAppSelector(selectUserData);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const onLogout = () => {
    setIsVisibleUserInfo(false);
    destroyCookie(null, "authToken", { path: "/" });
    router.push("/");
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
              <span className={styles.surname}>{userData?.surname}</span>
            </div>
            <svg
              className={styles.logoutButton}
              onClick={onLogout}
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.2917 15.333L20.125 11.4997M20.125 11.4997L16.2917 7.66634M20.125 11.4997H6.70833M12.4583 15.333V16.2913C12.4583 17.0538 12.1554 17.7851 11.6163 18.3243C11.0771 18.8634 10.3458 19.1663 9.58333 19.1663H5.75C4.9875 19.1663 4.25624 18.8634 3.71707 18.3243C3.1779 17.7851 2.875 17.0538 2.875 16.2913V6.70801C2.875 5.94551 3.1779 5.21424 3.71707 4.67508C4.25624 4.13591 4.9875 3.83301 5.75 3.83301H9.58333C10.3458 3.83301 11.0771 4.13591 11.6163 4.67508C12.1554 5.21424 12.4583 5.94551 12.4583 6.70801V7.66634"
                stroke="#25182E"
                strokeWidth="1.91667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};
