import React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "@/layouts/MainLayout";

import styles from "@/pages/friends/Friends.module.scss";

import { Api } from "@/api/index";
import { IUser } from "@/api/types";

import { PageTitle } from "@/components/UI/PageTitle";
import { NullResultsBlock } from "@/components/UI/NullResultsBlock";
import { UserItem } from "@/components/UserItem";

const Friends: NextPage = ({
  friends,
  user,
}: {
  friends: IUser[];
  user: IUser;
}) => {
  return (
    <MainLayout fullWidth>
      <Head>
        <title>{"Друзья " + user?.name + " " + user?.surname}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <PageTitle pageTitle={"Друзья " + user?.name + " " + user?.surname} />
        <div className={styles.content}>
          <div
            className={styles.friendsBlock}
            style={{ gridTemplateColumns: friends?.length < 3 && "1fr" }}
          >
            {!friends?.length ? (
              <NullResultsBlock text="Список друзей пуст" />
            ) : (
              friends?.map((friend) => (
                <UserItem key={friend?.userId} {...friend} menuHidden />
              ))
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};

export default Friends;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ctx.req.cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const friends = await Api().user.getFriends(ctx.params.id);

  const user = await Api().user.getOne(ctx.params.id);

  return {
    props: { friends, user },
  };
};