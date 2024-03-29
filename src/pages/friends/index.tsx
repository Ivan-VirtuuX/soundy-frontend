import React from "react";

import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { MainLayout } from "@/layouts/MainLayout";

import { SearchInput } from "@/components/SearchInput";
import { BlueButton } from "@/components/ui/BlueButton";
import { PageTitle } from "@/components/ui/PageTitle";
import { NullResultsBlock } from "@/components/ui/NullResultsBlock";
import { UserItem } from "@/components/UserItem";
import { ArrowRightIcon } from "@/components/ui/Icons/ArrowRightIcon";
import { NotificationsBlock } from "@/components/NotificationsBlock";

import { Api } from "@/api";
import { IUser } from "@/api/types";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { filterItems } from "@/utils/filterItems";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import styles from "./Friends.module.scss";

const Friends: NextPage = () => {
  const [searchText, setSearchText] = React.useState("");
  const [friends, setFriends] = React.useState<IUser[]>([]);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  const [parent] = useAutoAnimate();

  const onDeleteFriend = async (userId: string) => {
    try {
      setFriends([...friends.filter((friend) => friend.userId !== userId)]);

      await Api().user.deleteFriend(userData?.userId, userId);
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().user.getFriends(userData?.userId);

        setFriends(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

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
            <ul
              className={styles.friendsBlock}
              style={{ gridTemplateColumns: friends?.length < 3 && "1fr" }}
              ref={parent}
            >
              {searchText
                ? filterItems(
                    friends,
                    ["name", "surname", "login"],
                    searchText
                  ).map((friend) => (
                    <li key={friend.userId}>
                      <UserItem
                        handleDelete={(userId: string) =>
                          onDeleteFriend(userId)
                        }
                        type="friends"
                        {...friend}
                      />
                    </li>
                  ))
                : friends?.map((friend) => (
                    <li key={friend.userId}>
                      <UserItem
                        key={friend.userId}
                        handleDelete={(userId: string) =>
                          onDeleteFriend(userId)
                        }
                        {...friend}
                        type="friends"
                      />
                    </li>
                  ))}
            </ul>
          )}
        </div>
        <NotificationsBlock />
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
