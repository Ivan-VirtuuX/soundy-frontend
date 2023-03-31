import React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { MainLayout } from "@/layouts/MainLayout";

import { PageTitle } from "@/components/ui/PageTitle";
import { NullResultsBlock } from "@/components/ui/NullResultsBlock";
import { UserItem } from "@/components/UserItem";
import { BlueButton } from "@/components/ui/BlueButton";
import { NotificationWindow } from "@/components/NotificationWindow";

import { IUser } from "@/api/types";
import { Api } from "@/api/index";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { useNotifications } from "@/hooks/useNotifications";

import styles from "./FriendRequests.module.scss";

const FriendRequests: NextPage = ({
  friendRequests,
}: {
  friendRequests: IUser[];
}) => {
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [isCancelled, setIsCancelled] = React.useState(false);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  const { notificationMessage, setNotificationMessage } = useNotifications(
    userData?.id
  );

  const onClickAccept = async (userId: string) => {
    try {
      await Api().user.confirmFriendRequest(userData?.id, userId);

      setIsConfirmed(true);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickCancel = async (userId: string) => {
    await Api().user.cancelFriendRequest(userId, userData?.id);

    setIsCancelled(true);
  };

  return (
    <MainLayout fullWidth>
      <Head>
        <title>Заявки в друзья</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <PageTitle pageTitle="Заявки в друзья" />
        <div className={styles.content}>
          <div
            className={styles.friendsBlock}
            style={{ gridTemplateColumns: friendRequests?.length < 3 && "1fr" }}
          >
            {!friendRequests?.length ? (
              <div className={styles.emptyRequestsBlock}>
                <NullResultsBlock text="Список заявок пуст" />
                <BlueButton
                  handleClick={() => router.push("/friends")}
                  text="К списку друзей"
                  color="primary"
                  width={270}
                />
              </div>
            ) : (
              friendRequests?.map((friend) => (
                <UserItem
                  key={friend?.userId}
                  {...friend}
                  type="requestFriends"
                  isConfirmed={isConfirmed}
                  isCancelled={isCancelled}
                  handleAccept={(userId) => onClickAccept(userId)}
                  handleCancel={(userId) => onClickCancel(userId)}
                />
              ))
            )}
          </div>
        </div>
        {notificationMessage && (
          <NotificationWindow
            notificationMessage={notificationMessage}
            handleCloseNotificationMessage={() => setNotificationMessage(null)}
          />
        )}
      </main>
    </MainLayout>
  );
};

export default FriendRequests;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ctx.req.cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await Api(ctx).user.getMe();

  const friendRequests = await Api().user.getFriendRequests(user.id);

  return {
    props: { friendRequests },
  };
};
