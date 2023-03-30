import React from "react";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { MainLayout } from "@/layouts/MainLayout";

import { PageTitle } from "@/components/ui/PageTitle";
import { SearchInput } from "@/components/SearchInput";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Api } from "@/api/index";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { musicTracks } from "@/musicTracks.data";

import styles from "./Music.module.scss";
import { ITrack } from "@/api/types";
import { NotificationWindow } from "@/components/NotificationWindow";
import { useNotifications } from "@/hooks/useNotifications";

const Music: NextPage = () => {
  const [playlistTracks, setPlaylistTracks] = React.useState<ITrack[]>();
  const [searchText, setSearchText] = React.useState("");

  const userData = useAppSelector(selectUserData);

  const { notificationMessage, setNotificationMessage } = useNotifications(
    userData?.id
  );

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().user.getOne(userData?.id);

        setPlaylistTracks(data.playlist);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

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
        <div className={styles.musicBlock}>
          <SearchInput
            placeholder="Введите название трека"
            width={600}
            handleChange={(text) => setSearchText(text)}
          />
          <MusicPlayer
            searchText={searchText}
            tracks={musicTracks}
            playlistTracks={playlistTracks}
            handleChangeUserTracks={(track) =>
              setPlaylistTracks([...playlistTracks, track])
            }
            handleRemoveTrack={(track) =>
              setPlaylistTracks([
                ...playlistTracks.filter(
                  (playlistTrack) => playlistTrack.id !== track.id
                ),
              ])
            }
          />
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
