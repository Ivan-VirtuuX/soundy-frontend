import React from "react";

import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { MainLayout } from "@/layouts/MainLayout";

import { SearchInput } from "@/components/UI/SearchInput";
import { BlueButton } from "@/components/UI/BlueButton";
import { PageTitle } from "@/components/UI/PageTitle";
import { NullResultsBlock } from "@/components/UI/NullResultsBlock";
import { UserItem } from "@/components/UserItem";
import { ArrowRightIcon } from "@/components/UI/Icons/ArrowRightIcon";

import { Api } from "@/api/index";
import { IUser } from "@/api/types";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import styles from "./Friends.module.scss";

const Friends: NextPage = () => {
  const [searchText, setSearchText] = React.useState("");
  const [friends, setFriends] = React.useState<IUser[]>([]);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().user.getFriends(userData?.id);

        setFriends(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  const onDeleteFriend = async (userId: string) => {
    try {
      setFriends([...friends.filter((friend) => friend.userId !== userId)]);

      await Api().user.deleteFriend(userData?.id, userId);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <MainLayout fullWidth>
      <Head>
        <title>Друзья</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <PageTitle pageTitle="Друзья" />
        <div className={styles.content}>
          <div className={styles.searchBlock}>
            <SearchInput handleChange={(text) => setSearchText(text)} />
            <BlueButton
              handleClick={() => router.push("/friend-requests")}
              text="Заявки"
              color="primary"
            >
              <ArrowRightIcon />
            </BlueButton>
          </div>
          {!friends.length ? (
            <NullResultsBlock text="Список друзей пуст" />
          ) : (
            <div
              className={styles.friendsBlock}
              style={{ gridTemplateColumns: friends?.length < 3 && "1fr" }}
            >
              {searchText
                ? friends
                    .filter(
                      (friend) =>
                        friend.name
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        friend.surname
                          .toLowerCase()
                          .includes(searchText.toLowerCase()) ||
                        friend.login
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                    )
                    .map((friend) => (
                      <UserItem
                        key={friend.userId}
                        handleDelete={(userId: string) =>
                          onDeleteFriend(userId)
                        }
                        type="friends"
                        {...friend}
                      />
                    ))
                : friends?.map((friend) => (
                    <UserItem
                      key={friend.userId}
                      handleDelete={(userId: string) => onDeleteFriend(userId)}
                      {...friend}
                      type="friends"
                    />
                  ))}
            </div>
          )}
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
  return {
    props: {},
  };
};