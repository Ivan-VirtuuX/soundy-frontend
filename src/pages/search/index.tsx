import React from "react";
import { InfinitySpin } from "react-loader-spinner";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "@/layouts/MainLayout";

import { PageTitle } from "@/components/UI/PageTitle";
import { SearchInput } from "@/components/UI/SearchInput";
import { BlueButton } from "@/components/UI/BlueButton";
import { UsersIcon } from "@/components/UI/Icons/UsersIcon";
import { PostIcon } from "@/components/UI/Icons/PostIcon";

import { SearchedData } from "@/components/SearchedData";

import { Api } from "@/api/index";
import { IPost, IUser } from "@/api/types";

import styles from "./Search.module.scss";

const Search: NextPage = () => {
  const [searchedData, setSearchedData] = React.useState<IUser[] | IPost[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isEmptyData, setIsEmptyData] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [type, setType] = React.useState<"users" | "posts">("users");

  const searchData = React.useCallback(
    async (type: "users" | "posts") => {
      try {
        if (searchQuery && searchQuery !== " ") {
          if (type === "users") {
            await setSearchedData([]);

            setPage(1);

            setType("users");

            const splitSearchUsers = searchQuery.split(" ");

            if (splitSearchUsers.length === 2) {
              setIsLoading(true);

              const data = await Api().user.searchUsers(
                {
                  _name: splitSearchUsers[0],
                  _surname: splitSearchUsers[1],
                },
                page
              );

              setSearchedData(data);

              setIsLoading(false);

              !data.length ? setIsEmptyData(true) : setIsEmptyData(false);
            } else if (splitSearchUsers.length === 1) {
              await setSearchedData([]);

              setPage(1);

              setIsLoading(true);

              const data = await Api().user.searchUsers(
                {
                  _query: splitSearchUsers[0],
                },
                page
              );

              setSearchedData(data);

              setIsLoading(false);

              !data.length ? setIsEmptyData(true) : setIsEmptyData(false);
            }
          } else if (type === "posts") {
            await setSearchedData([]);

            setPage(1);

            setType("posts");

            setIsLoading(true);

            const data = await Api().post.searchPosts(searchQuery, page);

            setSearchedData(data);

            setIsLoading(false);

            !data.length ? setIsEmptyData(true) : setIsEmptyData(false);
          }
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [page, searchQuery]
  );

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
          <div className={styles.searchBlock}>
            <SearchInput handleChange={(text) => setSearchQuery(text)} />
            <div className={styles.actions}>
              <BlueButton
                text="Найти"
                color="primary"
                handleClick={() => searchData("users")}
              >
                <UsersIcon color="white" />
              </BlueButton>
              <BlueButton
                text="Найти"
                color="primary"
                handleClick={() => searchData("posts")}
              >
                <PostIcon color="white" />
              </BlueButton>
            </div>
          </div>
          <SearchedData
            handleLoading={(isLoading) => setIsLoading(isLoading)}
            handleSearchedData={(data) => setSearchedData(data)}
            handleChangeDataPage={() => setPage((page) => page + 1)}
            searchQuery={searchQuery}
            searchedData={searchedData}
            page={page}
            type={type}
            isLoading={isLoading}
            isEmptyResults={isEmptyData}
          />
          {isLoading && <InfinitySpin width="200" color="#181F92" />}
        </div>
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
