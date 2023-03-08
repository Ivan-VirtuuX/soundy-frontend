import React from "react";
import { InfinitySpin } from "react-loader-spinner";
import { useInView } from "react-intersection-observer";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "@/layouts/MainLayout";

import { IUser } from "@/api/types";

import { Api } from "@/api/index";

import { PageTitle } from "@/components/UI/PageTitle";
import { NotFoundBlock } from "@/components/UI/NotFoundBlock";
import { SearchInput } from "@/components/UI/SearchInput";
import { BlueButton } from "@/components/UI/BlueButton";
import { UsersIcon } from "@/components/UI/Icons/UsersIcon";
import { UserItem } from "@/components/UserItem";
import { PostIcon } from "@/components/UI/Icons/PostIcon";

import { Button } from "@material-ui/core";

import styles from "./Search.module.scss";

const Search: NextPage = () => {
  const [searchUserQuery, setSearchUserQuery] = React.useState("");
  const [isEmptyResults, setIsEmptyResults] = React.useState(false);
  const [searchedUsers, setSearchedUsers] = React.useState<IUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const searchUsers = async () => {
    try {
      if (searchUserQuery && searchUserQuery !== " ") {
        setPage(1);

        setSearchedUsers([]);

        const splitSearchUsers = searchUserQuery.split(" ");

        if (splitSearchUsers.length === 2) {
          setIsLoading(true);

          const data = await Api().user.findUsers(
            {
              _name: splitSearchUsers[0],
              _surname: splitSearchUsers[1],
            },
            page
          );

          setSearchedUsers(data);

          setIsLoading(false);

          !data.length ? setIsEmptyResults(true) : setIsEmptyResults(false);
        } else if (splitSearchUsers.length === 1) {
          setPage(1);

          setIsLoading(true);

          const data = await Api().user.findUsers(
            {
              _query: splitSearchUsers[0],
            },
            page
          );

          setSearchedUsers(data);

          setIsLoading(false);

          !data.length ? setIsEmptyResults(true) : setIsEmptyResults(false);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const loadMoreResults = async (pageNumber) => {
    try {
      if (searchUserQuery) {
        const splitSearchUsers = searchUserQuery.split(" ");

        if (splitSearchUsers.length === 2) {
          setIsLoading(true);

          const data = await Api().user.findUsers(
            {
              _name: splitSearchUsers[0],
              _surname: splitSearchUsers[1],
            },
            pageNumber
          );

          setSearchedUsers([...searchedUsers.concat(data)]);

          setIsLoading(false);

          setPage((page) => page + 1);
        } else if (splitSearchUsers.length === 1) {
          setIsLoading(true);

          const data = await Api().user.findUsers(
            {
              _query: splitSearchUsers[0],
            },
            pageNumber
          );

          setSearchedUsers([...searchedUsers.concat(data)]);

          setIsLoading(false);

          setPage((page) => page + 1);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        if (inView && page !== 1) {
          setIsLoading(true);

          await loadMoreResults(page);

          setIsLoading(false);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [inView]);

  return (
    <MainLayout fullWidth>
      <Head>
        <title>Поиск</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <PageTitle pageTitle="Поиск" />
        <div className={styles.content}>
          <div>
            <SearchInput handleChange={(text) => setSearchUserQuery(text)} />
            <div className={styles.actions}>
              <BlueButton
                text="Найти"
                color="primary"
                handleClick={searchUsers}
              >
                <UsersIcon color="white" />
              </BlueButton>
              <BlueButton text="Найти" color="primary">
                <PostIcon color="white" />
              </BlueButton>
            </div>
          </div>
          {searchedUsers && (
            <div
              className={styles.searchedUsersBlock}
              style={{
                gridTemplateColumns: searchedUsers?.length < 3 && "1fr",
              }}
            >
              {searchedUsers.map((user) => (
                <UserItem
                  key={user.userId}
                  {...user}
                  menuHidden
                  innerRef={ref}
                />
              ))}
            </div>
          )}
          {isLoading && (
            <div className={styles.loadSpinner}>
              <InfinitySpin width="200" color="#181F92" />
            </div>
          )}
          {page === 1 && searchedUsers.length > 0 && !isLoading && (
            <Button onClick={() => loadMoreResults(2)} variant="outlined">
              Загрузить еще...
            </Button>
          )}
        </div>
        {isEmptyResults && (
          <NotFoundBlock text="По данному запросу ничего не найдено" />
        )}
      </main>
    </MainLayout>
  );
};

export default Search;

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
