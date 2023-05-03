import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import React from "react";

import { IPost, IUser } from "@/api/types";
import { Api } from "@/api";

import { MainLayout } from "@/layouts/MainLayout";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { FriendsList } from "@/components/FriendsList";
import { Line } from "@/components/ui/Line";
import { ChangeAvatarPopup } from "@/components/ChangeAvatarPopup";
import { ProfileActions } from "@/components/ProfileActions";
import { UserPosts } from "@/components/UserPosts";
import { NotificationsBlock } from "@/components/NotificationsBlock";

import { truncateString } from "@/utils/truncateString";

import styles from "./Users.module.scss";

const Users: NextPage<IUser> = ({
  login,
  name,
  surname,
  avatarUrl,
  birthDate,
  friends,
  friendRequests,
}) => {
  const [isLoadingConversation, setIsLoadingConversation] =
    React.useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = React.useState(false);
  const [localBirthDate, setLocalBirthDate] = React.useState(birthDate);
  const [localSurname, setLocalSurname] = React.useState(surname);
  const [isAddFriend, setIsAddFriend] = React.useState(false);
  const [userTracks, setUserTracks] = React.useState([]);
  const [pinnedPost, setPinnedPost] = React.useState<IPost>(null);
  const [localName, setLocalName] = React.useState(name);
  const [avatar, setAvatar] = React.useState(avatarUrl);

  const router = useRouter();

  const { query } = useRouter();

  const userData = useAppSelector(selectUserData);

  const createConversation = async () => {
    try {
      setIsLoadingConversation(true);

      const data = await Api().conversation.createConversation({
        receiver: query.id,
      });

      await router.push(`/conversations/${data.conversationId}`);

      setIsLoadingConversation(false);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  const onChangePinnedPost = (post: IPost) => {
    post ? setPinnedPost(post) : setPinnedPost(null);
  };

  React.useEffect(() => {
    (async () => {
      setLocalName(name);
      setLocalSurname(surname);
      setLocalBirthDate(birthDate);
      setAvatar(avatarUrl);

      try {
        const data = await Api().post.getPinnedPost(query?.id);

        if (data) setPinnedPost(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [query?.id]);

  React.useEffect(() => {
    friendRequests.find((user) => user.userId === userData?.userId)
      ? setIsAddFriend(true)
      : setIsAddFriend(false);
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().user.getOne(query?.id);

        setUserTracks(data.playlist);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [query.id]);

  return (
    <MainLayout fullWidth>
      <Head>
        <title>{localName + " " + truncateString(localSurname, 10)}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <div className={styles.head}>
          <div className={styles.headContent}>
            <div className={styles.headContentLeftSide}>
              <div className={styles.avatarBlock}>
                {avatar ? (
                  <Image
                    className={styles.avatar}
                    src={avatar}
                    alt="avatar"
                    width={150}
                    height={150}
                    quality={100}
                  />
                ) : (
                  <EmptyAvatar width={150} />
                )}
                {userData?.userId === query?.id && (
                  <ChangeAvatarPopup
                    handleChangeAvatar={(avatarUrl) => setAvatar(avatarUrl)}
                  />
                )}
              </div>
              <div className={styles.headContentUserInfo}>
                <div className={styles.userInfo}>
                  <div className={styles.nameSurnameBlock}>
                    <span
                      className={styles.name}
                      style={{ fontSize: localName.length >= 7 ? 20 : 35 }}
                    >
                      {localName}
                    </span>
                    <span
                      className={styles.surname}
                      style={{ fontSize: localName.length >= 7 ? 20 : 35 }}
                    >
                      {localSurname}
                    </span>
                  </div>
                  <span className={styles.login}>{login}</span>
                </div>
                <div className={styles.middleBlock}>
                  <div className={styles.birthDateBlock}>
                    <span className={styles.birthDateBlockTitle}>
                      Дата рождения
                    </span>
                    <span className={styles.birthDateBlockDate}>
                      {new Date(localBirthDate).toLocaleDateString("ru-Ru")}
                    </span>
                  </div>
                  {userTracks.length !== 0 && (
                    <div
                      className={styles.musicBlock}
                      onClick={() => router.push(`/users/${query.id}/playlist`)}
                    >
                      <span className={styles.musicBlockTitle}>Музыка</span>
                      <div className={styles.musicBlockTracks}>
                        {userTracks.slice(-4).map((track) => (
                          <Image
                            key={track.id}
                            width={35}
                            height={35}
                            className={styles.trackCover}
                            quality={100}
                            src={track.coverUrl}
                            alt="track cover image"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.friendsBlock}>
              <div
                className={styles.friendsBlockHead}
                onClick={() =>
                  query?.id === userData?.userId
                    ? router.push("/friends")
                    : router.push(`/users/${query?.id}/friends`)
                }
              >
                <span className={styles.friendsBlockTitle}>Друзья</span>
                <span className={styles.friendsBlockFriendsCount}>
                  {friends?.length}
                </span>
              </div>
              <FriendsList friends={friends} />
            </div>
          </div>
          <ProfileActions
            onOpenEdit={() => setIsEditProfileVisible(true)}
            onCloseEdit={() => setIsEditProfileVisible(false)}
            handleAddFriend={(isAdd) => setIsAddFriend(isAdd)}
            handleChangeName={(text) => setLocalName(text)}
            handleChangeSurname={(text) => setLocalSurname(text)}
            handleChangeBirthDate={(date) => setLocalBirthDate(date)}
            handleClickMessageButton={createConversation}
            friends={friends}
            isAddFriend={isAddFriend}
            isEditProfileVisible={isEditProfileVisible}
            localName={localName}
            localSurname={localSurname}
            localBirthDate={localBirthDate}
            isLoadingConversation={isLoadingConversation}
          />
          <Line />
        </div>
        <UserPosts
          handleChangePinnedPost={onChangePinnedPost}
          pinnedPost={pinnedPost}
          userId={query.id}
        />
        <NotificationsBlock />
      </main>
    </MainLayout>
  );
};

export default Users;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ctx.req.cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    try {
      const user = await Api().user.getOne(ctx.params.id);

      return {
        props: { ...user },
      };
    } catch (err) {
      console.warn(err);
    }
  }
};
