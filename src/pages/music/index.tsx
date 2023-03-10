import React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "@/layouts/MainLayout";

import { PageTitle } from "@/components/UI/PageTitle";
import { SearchInput } from "@/components/UI/SearchInput";
import { BlueButton } from "@/components/UI/BlueButton";
import { MusicIcon } from "@/components/UI/Icons/MusicIcon";
import { AudioPlayer } from "@/components/AudioPlayer";

import styles from "./Music.module.scss";

const Music: NextPage = () => {
  return (
    <MainLayout fullWidth>
      <Head>
        <title>Музыка</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <PageTitle pageTitle="Музыка" />
        <div className={styles.searchBlock}>
          <SearchInput placeholder="Введите название трека" width={600} />
          <BlueButton color="primary" text="Найти">
            <MusicIcon color="white" />
          </BlueButton>
          <AudioPlayer />
        </div>
      </main>
    </MainLayout>
  );
};

export default Music;

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
