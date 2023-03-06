import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import React from "react";
import { useInView } from "react-intersection-observer";
import { InfinitySpin } from "react-loader-spinner";

import { ChangeUserDataDto, IPost, IUser } from "@/api/types";
import { Api } from "@/api/index";

import { EmptyAvatar } from "@/components/UI/EmptyAvatar";
import { FriendsList } from "@/components/FriendsList";
import { BlueButton } from "@/components/UI/BlueButton";
import { Line } from "@/components/UI/Line";
import { PageTitle } from "@/components/UI/PageTitle";
import { Post } from "@/components/Post";
import { EditProfileForm } from "@/components/EditProfileForm";
import { NullResultsBlock } from "@/components/UI/NullResultsBlock";

import { MainLayout } from "@/layouts/MainLayout";

import { usePosts } from "@/hooks/usePosts";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";

import { CloudinaryApi } from "@/api/CloudinaryApi";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import styles from "./Users.module.scss";

const Users: NextPage<IUser> = ({
  id,
  login,
  name,
  surname,
  avatarUrl,
  birthDate,
  friends,
  friendRequests,
}) => {
  const [attachedImageFormData, setAttachedImageFormData] = React.useState([]);
  const [isEditProfileVisible, setIsEditProfileVisible] = React.useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = React.useState(false);
  const [isDeleteFriend, setIsDeleteFriend] = React.useState(false);
  const [localBirthDate, setLocalBirthDate] = React.useState(birthDate);
  const [filteredPosts, setFilteredPosts] = React.useState<IPost[]>([]);
  const [attachedImage, setAttachedImage] = React.useState<File>();
  const [localSurname, setLocalSurname] = React.useState(surname);
  const [localFriends, setLocalFriends] = React.useState(friends);
  const [isCancelled, setIsCancelled] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAddFriend, setIsAddFriend] = React.useState(false);
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [pinnedPost, setPinnedPost] = React.useState<IPost>();
  const [localName, setLocalName] = React.useState(name);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newPosts, setNewPosts] = React.useState<IPost[]>([]);
  const [preview, setPreview] = React.useState("");
  const [avatar, setAvatar] = React.useState(avatarUrl);
  const [image, setImage] = React.useState<File>();
  const [page, setPage] = React.useState(1);

  const attachedImageRef = React.useRef(null);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const router = useRouter();

  const { query } = useRouter();

  const { posts, setPosts } = usePosts(newPosts, page, pinnedPost, query?.id);

  const userData = useAppSelector(selectUserData);

  const onCloseImage = async () => {
    await setAttachedImageFormData([]);
    await setAttachedImageFormData([]);
    await setAttachedImage(undefined);
    await setIsSaveImage(false);
    await setPreview("");
    await setIsChangeAvatarOpen(false);
  };

  const onSubmitAttachedImage = async () => {
    try {
      setIsUploading(true);

      const { data } = await CloudinaryApi().cloudinary.changeImage(
        attachedImageFormData
      );

      await Api().user.updateAvatar(userData.id, data.secure_url);

      setIsUploading(false);

      setAvatar(data.secure_url);

      return data;
    } catch (err) {
      console.warn(err);

      alert("Update image error");
    } finally {
      setIsSaveImage(false);
      setIsUploading(false);
      setIsChangeAvatarOpen(false);
    }
  };

  const onChangeImage = () => attachedImageRef?.current?.click();

  const onClickChangeAvatarButton = () => onChangeImage();

  const handleChangeImage = async (files) => {
    try {
      const formData: any = new FormData();

      formData.append("file", files[0]);
      formData.append("upload_preset", "cqxjdiz4");

      setAttachedImageFormData(formData);

      setAttachedImage(files[0]);

      files && setIsSaveImage(true);
    } catch (err) {
      console.warn(err);

      alert("Ошибка при загрузке файла");
    }
  };

  const onEditProfile = (data: ChangeUserDataDto) => {
    setIsEditProfileVisible(false);
    setLocalName(data.name);
    setLocalSurname(data.surname);
    setLocalBirthDate(data.birthDate);
  };

  const addFriend = async () => {
    try {
      await Api().user.addFriendRequests(query?.id);

      setIsAddFriend(true);
    } catch (err) {
      console.warn(err);
    }
  };

  const deleteFriend = async () => {
    try {
      await Api().user.deleteFriend(userData?.id, query?.id);

      setIsDeleteFriend(true);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickCancel = async () => {
    await Api().user.cancelFriendRequest(userData?.id, query?.id);

    setIsCancelled(true);
  };

  React.useEffect(() => {
    (async () => {
      if (posts.length >= 5) {
        try {
          if (inView && posts) {
            setIsLoading(true);

            const data = await Api().post.getUserPosts(page, query?.id);

            setNewPosts(data);

            setPage((page) => page + 1);

            setIsLoading(false);
          }
        } catch (err) {
          console.warn(err);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [inView, query?.id]);

  React.useEffect(() => {
    if (isSaveImage) setIsChangeAvatarOpen(true);
  }, [attachedImage]);

  React.useEffect(() => {
    if (attachedImage) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(attachedImage);
    } else {
      setPreview(null);
    }
  }, [image, attachedImage]);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().post.getPinnedPost(query?.id);

        if (data[0]) setPinnedPost(data[0]);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [query?.id]);

  React.useEffect(() => {
    setLocalName(name);
    setLocalSurname(surname);
    setLocalBirthDate(birthDate);
    setAvatar(avatarUrl);
  }, [query?.id]);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().post.getPinnedPost(query?.id);

        if (data[0]) {
          setFilteredPosts([
            data[0],
            ...posts.filter((post) => post.postId !== data[0].postId),
          ]);
        } else {
          const data = await Api().post.getUserPosts(page, query?.id);

          setFilteredPosts(data);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [posts, query?.id]);

  return (
    <MainLayout fullWidth>
      <Head>
        <title>{localName + " " + localSurname}</title>
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
                {userData?.id === query?.id && (
                  <div className={styles.changeAvatarButton}>
                    <IconButton
                      size="medium"
                      color="primary"
                      onClick={onClickChangeAvatarButton}
                    >
                      <form>
                        <div className={styles.attachImageButton}>
                          <input
                            accept="image/*"
                            ref={attachedImageRef}
                            type="file"
                            onChange={(e) => handleChangeImage(e.target.files)}
                            hidden
                          />
                        </div>
                      </form>
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_8_1175)">
                          <path
                            d="M9.90719 11.5349C11.2558 11.5349 12.3491 10.4416 12.3491 9.09302C12.3491 7.74442 11.2558 6.65116 9.90719 6.65116C8.55859 6.65116 7.46533 7.74442 7.46533 9.09302C7.46533 10.4416 8.55859 11.5349 9.90719 11.5349Z"
                            fill="#181F92"
                          />
                          <path
                            d="M16.4187 3.39535H13.8385L12.8292 2.29651C12.6775 2.12997 12.4928 1.9969 12.2867 1.9058C12.0807 1.8147 11.858 1.76758 11.6327 1.76744H8.18153C7.72572 1.76744 7.28618 1.96279 6.97688 2.29651L5.97572 3.39535H3.39549C2.50014 3.39535 1.76758 4.12791 1.76758 5.02325V14.7907C1.76758 15.686 2.50014 16.4186 3.39549 16.4186H16.4187C17.3141 16.4186 18.0466 15.686 18.0466 14.7907V5.02325C18.0466 4.12791 17.3141 3.39535 16.4187 3.39535ZM9.90711 13.9767C7.6606 13.9767 5.83735 12.1535 5.83735 9.90698C5.83735 7.66046 7.6606 5.83721 9.90711 5.83721C12.1536 5.83721 13.9769 7.66046 13.9769 9.90698C13.9769 12.1535 12.1536 13.9767 9.90711 13.9767Z"
                            fill="#181F92"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_8_1175">
                            <rect
                              width="17.907"
                              height="17.907"
                              fill="white"
                              transform="translate(0.953613 0.139542)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </IconButton>
                  </div>
                )}
              </div>
              <div className={styles.headContentUserInfo}>
                <div className={styles.userInfo}>
                  <div className={styles.nameSurnameBlock}>
                    <span className={styles.name}>{localName}</span>
                    <span className={styles.surname}>{localSurname}</span>
                  </div>
                  <span className={styles.login}>{login}</span>
                </div>
                <div className={styles.birthDateBlock}>
                  <span className={styles.birthDateBlockTitle}>
                    Дата рождения
                  </span>
                  <span className={styles.birthDateBlockDate}>
                    {new Date(localBirthDate).toLocaleDateString("ru-Ru")}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.friendsBlock}>
              <div
                className={styles.friendsBlockHead}
                onClick={() =>
                  query?.id === userData?.id
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
          <div className={styles.profileActionsBlock}>
            {userData?.id === query?.id && (
              <BlueButton
                handleClick={() => setIsEditProfileVisible(true)}
                size="sm"
                text="Редактировать"
              >
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.7 9.35L16.7 10.35L14.65 8.3L15.65 7.3C15.7528 7.19923 15.891 7.14278 16.035 7.14278C16.179 7.14278 16.3172 7.19923 16.42 7.3L17.7 8.58C17.91 8.79 17.91 9.14 17.7 9.35ZM8 14.94L14.06 8.88L16.11 10.93L10.06 17H8V14.94ZM8 10C3.58 10 0 11.79 0 14V16H6V14.11L10 10.11C9.34 10.03 8.67 10 8 10ZM8 0C6.93913 0 5.92172 0.421427 5.17157 1.17157C4.42143 1.92172 4 2.93913 4 4C4 5.06087 4.42143 6.07828 5.17157 6.82843C5.92172 7.57857 6.93913 8 8 8C9.06087 8 10.0783 7.57857 10.8284 6.82843C11.5786 6.07828 12 5.06087 12 4C12 2.93913 11.5786 1.92172 10.8284 1.17157C10.0783 0.421427 9.06087 0 8 0Z"
                    fill="white"
                  />
                </svg>
              </BlueButton>
            )}
            {userData?.id !== query?.id && (
              <BlueButton size="sm" text="Сообщение">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 5.875V5.88313M4.25 5.875V5.88313M10.75 5.875V5.88313M1 14V3.4375C1 2.79103 1.25681 2.17105 1.71393 1.71393C2.17105 1.25681 2.79103 1 3.4375 1H11.5625C12.209 1 12.829 1.25681 13.2861 1.71393C13.7432 2.17105 14 2.79103 14 3.4375V8.3125C14 8.95897 13.7432 9.57895 13.2861 10.0361C12.829 10.4932 12.209 10.75 11.5625 10.75H4.25L1 14Z"
                    stroke="white"
                    strokeWidth="1.40541"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </BlueButton>
            )}
            {userData?.id === query?.id && (
              <BlueButton
                handleClick={() => router.push("/write")}
                size="sm"
                text="Создать пост"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6882 5.01322L8.64066 2.00154L9.64455 0.997648C9.91943 0.722773 10.2572 0.585335 10.6578 0.585335C11.0584 0.585335 11.3959 0.722773 11.6703 0.997648L12.6742 2.00154C12.949 2.27642 13.0925 2.60818 13.1044 2.99683C13.1164 3.38548 12.9849 3.71701 12.71 3.9914L11.6882 5.01322ZM10.6484 6.0709L3.04754 13.6718H0V10.6243L7.60091 3.02336L10.6484 6.0709Z"
                    fill="white"
                  />
                </svg>
              </BlueButton>
            )}
            {query?.id !== userData?.id &&
              (friendRequests.find((user) => user.userId === userData?.id) ? (
                <>
                  {!isCancelled && (
                    <BlueButton
                      disabled
                      size="sm"
                      text="Заявка отправлена"
                      color="primary"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.02998 6.71147L9.0831 1.65835C9.27217 1.46929 9.51279 1.37476 9.80498 1.37476C10.0972 1.37476 10.3378 1.46929 10.5269 1.65835C10.7159 1.84741 10.8104 2.08804 10.8104 2.38022C10.8104 2.67241 10.7159 2.91304 10.5269 3.1021L4.75186 8.8771C4.54561 9.08335 4.30498 9.18647 4.02998 9.18647C3.75498 9.18647 3.51436 9.08335 3.30811 8.8771L0.626855 6.19585C0.437793 6.00679 0.343262 5.76616 0.343262 5.47397C0.343262 5.18179 0.437793 4.94116 0.626855 4.7521C0.815918 4.56304 1.05654 4.46851 1.34873 4.46851C1.64092 4.46851 1.88154 4.56304 2.07061 4.7521L4.02998 6.71147Z"
                          fill="#898989"
                        />
                      </svg>
                    </BlueButton>
                  )}
                  {isCancelled ? (
                    <BlueButton
                      disabled
                      size="sm"
                      text="Отклонена"
                      color="primary"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.02998 6.71147L9.0831 1.65835C9.27217 1.46929 9.51279 1.37476 9.80498 1.37476C10.0972 1.37476 10.3378 1.46929 10.5269 1.65835C10.7159 1.84741 10.8104 2.08804 10.8104 2.38022C10.8104 2.67241 10.7159 2.91304 10.5269 3.1021L4.75186 8.8771C4.54561 9.08335 4.30498 9.18647 4.02998 9.18647C3.75498 9.18647 3.51436 9.08335 3.30811 8.8771L0.626855 6.19585C0.437793 6.00679 0.343262 5.76616 0.343262 5.47397C0.343262 5.18179 0.437793 4.94116 0.626855 4.7521C0.815918 4.56304 1.05654 4.46851 1.34873 4.46851C1.64092 4.46851 1.88154 4.56304 2.07061 4.7521L4.02998 6.71147Z"
                          fill="#898989"
                        />
                      </svg>
                    </BlueButton>
                  ) : (
                    <BlueButton
                      handleClick={onClickCancel}
                      size="sm"
                      text="Отклонить"
                      color="primary"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.81027 2.48338L6.58442 5.70923L9.81027 8.93507C9.98138 9.10618 10.0775 9.33826 10.0775 9.58024C10.0775 9.82223 9.98138 10.0543 9.81027 10.2254C9.63916 10.3965 9.40708 10.4926 9.1651 10.4926C8.92311 10.4926 8.69104 10.3965 8.51993 10.2254L5.29408 6.99957L2.06824 10.2254C1.89713 10.3965 1.66506 10.4926 1.42307 10.4926C1.18109 10.4926 0.949011 10.3965 0.777902 10.2254C0.606792 10.0543 0.510664 9.82223 0.510664 9.58024C0.510664 9.33826 0.606792 9.10618 0.777902 8.93507L4.00375 5.70923L0.777902 2.48338C0.606792 2.31227 0.510664 2.0802 0.510664 1.83821C0.510664 1.59623 0.606792 1.36416 0.777902 1.19305C0.949011 1.02194 1.18109 0.925808 1.42307 0.925808C1.66506 0.925808 1.89713 1.02194 2.06824 1.19305L5.29408 4.41889L8.51993 1.19305C8.69104 1.02194 8.92311 0.925808 9.1651 0.925808C9.40708 0.925808 9.63916 1.02194 9.81027 1.19305C9.98138 1.36416 10.0775 1.59623 10.0775 1.83821C10.0775 2.0802 9.98138 2.31227 9.81027 2.48338Z"
                          fill="white"
                        />
                      </svg>
                    </BlueButton>
                  )}
                </>
              ) : !friends?.length ||
                !friends?.find((user) => user.userId === userData?.id) ? (
                isAddFriend ? (
                  <>
                    {!isCancelled && (
                      <BlueButton disabled size="sm" text="Заявка отправлена">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.02998 6.71147L9.0831 1.65835C9.27217 1.46929 9.51279 1.37476 9.80498 1.37476C10.0972 1.37476 10.3378 1.46929 10.5269 1.65835C10.7159 1.84741 10.8104 2.08804 10.8104 2.38022C10.8104 2.67241 10.7159 2.91304 10.5269 3.1021L4.75186 8.8771C4.54561 9.08335 4.30498 9.18647 4.02998 9.18647C3.75498 9.18647 3.51436 9.08335 3.30811 8.8771L0.626855 6.19585C0.437793 6.00679 0.343262 5.76616 0.343262 5.47397C0.343262 5.18179 0.437793 4.94116 0.626855 4.7521C0.815918 4.56304 1.05654 4.46851 1.34873 4.46851C1.64092 4.46851 1.88154 4.56304 2.07061 4.7521L4.02998 6.71147Z"
                            fill="#898989"
                          />
                        </svg>
                      </BlueButton>
                    )}
                    {isCancelled ? (
                      <BlueButton
                        disabled
                        size="sm"
                        text="Отклонена"
                        color="primary"
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.02998 6.71147L9.0831 1.65835C9.27217 1.46929 9.51279 1.37476 9.80498 1.37476C10.0972 1.37476 10.3378 1.46929 10.5269 1.65835C10.7159 1.84741 10.8104 2.08804 10.8104 2.38022C10.8104 2.67241 10.7159 2.91304 10.5269 3.1021L4.75186 8.8771C4.54561 9.08335 4.30498 9.18647 4.02998 9.18647C3.75498 9.18647 3.51436 9.08335 3.30811 8.8771L0.626855 6.19585C0.437793 6.00679 0.343262 5.76616 0.343262 5.47397C0.343262 5.18179 0.437793 4.94116 0.626855 4.7521C0.815918 4.56304 1.05654 4.46851 1.34873 4.46851C1.64092 4.46851 1.88154 4.56304 2.07061 4.7521L4.02998 6.71147Z"
                            fill="#898989"
                          />
                        </svg>
                      </BlueButton>
                    ) : (
                      <BlueButton
                        handleClick={onClickCancel}
                        size="sm"
                        text="Отклонить"
                        color="primary"
                      >
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.81027 2.48338L6.58442 5.70923L9.81027 8.93507C9.98138 9.10618 10.0775 9.33826 10.0775 9.58024C10.0775 9.82223 9.98138 10.0543 9.81027 10.2254C9.63916 10.3965 9.40708 10.4926 9.1651 10.4926C8.92311 10.4926 8.69104 10.3965 8.51993 10.2254L5.29408 6.99957L2.06824 10.2254C1.89713 10.3965 1.66506 10.4926 1.42307 10.4926C1.18109 10.4926 0.949011 10.3965 0.777902 10.2254C0.606792 10.0543 0.510664 9.82223 0.510664 9.58024C0.510664 9.33826 0.606792 9.10618 0.777902 8.93507L4.00375 5.70923L0.777902 2.48338C0.606792 2.31227 0.510664 2.0802 0.510664 1.83821C0.510664 1.59623 0.606792 1.36416 0.777902 1.19305C0.949011 1.02194 1.18109 0.925808 1.42307 0.925808C1.66506 0.925808 1.89713 1.02194 2.06824 1.19305L5.29408 4.41889L8.51993 1.19305C8.69104 1.02194 8.92311 0.925808 9.1651 0.925808C9.40708 0.925808 9.63916 1.02194 9.81027 1.19305C9.98138 1.36416 10.0775 1.59623 10.0775 1.83821C10.0775 2.0802 9.98138 2.31227 9.81027 2.48338Z"
                            fill="white"
                          />
                        </svg>
                      </BlueButton>
                    )}
                  </>
                ) : (
                  <BlueButton size="sm" text="Добавить" handleClick={addFriend}>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.16667 1C4.50363 1 3.86774 1.26339 3.3989 1.73223C2.93006 2.20107 2.66667 2.83696 2.66667 3.5C2.66667 4.16304 2.93006 4.79893 3.3989 5.26777C3.86774 5.73661 4.50363 6 5.16667 6C5.82971 6 6.46559 5.73661 6.93443 5.26777C7.40327 4.79893 7.66667 4.16304 7.66667 3.5C7.66667 2.83696 7.40327 2.20107 6.93443 1.73223C6.46559 1.26339 5.82971 1 5.16667 1ZM2.5 7.33333C1.83696 7.33333 1.20107 7.59673 0.732233 8.06557C0.263392 8.53441 0 9.17029 0 9.83333V10.6253C0 11.128 0.364 11.556 0.86 11.6367C3.712 12.1027 6.62133 12.1027 9.47333 11.6367C9.71338 11.5976 9.93171 11.4744 10.0893 11.2891C10.2468 11.1038 10.3333 10.8685 10.3333 10.6253V9.83333C10.3333 9.17029 10.0699 8.53441 9.6011 8.06557C9.13226 7.59673 8.49637 7.33333 7.83333 7.33333H7.60667C7.48333 7.33333 7.36067 7.35333 7.244 7.39067L6.66667 7.57933C5.69197 7.89749 4.64136 7.89749 3.66667 7.57933L3.08933 7.39067C2.97244 7.35262 2.85027 7.33327 2.72733 7.33333H2.5ZM10.8333 2.66667C10.9659 2.66667 11.0931 2.71934 11.1869 2.81311C11.2807 2.90688 11.3333 3.03406 11.3333 3.16667V4.33333H12.5C12.6326 4.33333 12.7598 4.38601 12.8536 4.47978C12.9473 4.57355 13 4.70072 13 4.83333C13 4.96594 12.9473 5.09312 12.8536 5.18689C12.7598 5.28065 12.6326 5.33333 12.5 5.33333H11.3333V6.5C11.3333 6.63261 11.2807 6.75978 11.1869 6.85355C11.0931 6.94732 10.9659 7 10.8333 7C10.7007 7 10.5735 6.94732 10.4798 6.85355C10.386 6.75978 10.3333 6.63261 10.3333 6.5V5.33333H9.16667C9.03406 5.33333 8.90688 5.28065 8.81311 5.18689C8.71934 5.09312 8.66667 4.96594 8.66667 4.83333C8.66667 4.70072 8.71934 4.57355 8.81311 4.47978C8.90688 4.38601 9.03406 4.33333 9.16667 4.33333H10.3333V3.16667C10.3333 3.03406 10.386 2.90688 10.4798 2.81311C10.5735 2.71934 10.7007 2.66667 10.8333 2.66667Z"
                        fill="white"
                      />
                    </svg>
                  </BlueButton>
                )
              ) : isDeleteFriend ? (
                <BlueButton
                  disabled
                  size="sm"
                  text="Удален"
                  handleClick={deleteFriend}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.02998 6.71147L9.0831 1.65835C9.27217 1.46929 9.51279 1.37476 9.80498 1.37476C10.0972 1.37476 10.3378 1.46929 10.5269 1.65835C10.7159 1.84741 10.8104 2.08804 10.8104 2.38022C10.8104 2.67241 10.7159 2.91304 10.5269 3.1021L4.75186 8.8771C4.54561 9.08335 4.30498 9.18647 4.02998 9.18647C3.75498 9.18647 3.51436 9.08335 3.30811 8.8771L0.626855 6.19585C0.437793 6.00679 0.343262 5.76616 0.343262 5.47397C0.343262 5.18179 0.437793 4.94116 0.626855 4.7521C0.815918 4.56304 1.05654 4.46851 1.34873 4.46851C1.64092 4.46851 1.88154 4.56304 2.07061 4.7521L4.02998 6.71147Z"
                      fill="#898989"
                    />
                  </svg>
                </BlueButton>
              ) : (
                <BlueButton size="sm" text="Удалить" handleClick={deleteFriend}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_279_2237)">
                      <path
                        d="M5.16667 0.860352C4.50363 0.860352 3.86774 1.12374 3.3989 1.59258C2.93006 2.06143 2.66667 2.69731 2.66667 3.36035C2.66667 4.02339 2.93006 4.65928 3.3989 5.12812C3.86774 5.59696 4.50363 5.86035 5.16667 5.86035C5.82971 5.86035 6.46559 5.59696 6.93443 5.12812C7.40327 4.65928 7.66667 4.02339 7.66667 3.36035C7.66667 2.69731 7.40327 2.06143 6.93443 1.59258C6.46559 1.12374 5.82971 0.860352 5.16667 0.860352ZM2.5 7.19368C1.83696 7.19368 1.20107 7.45708 0.732233 7.92592C0.263392 8.39476 0 9.03064 0 9.69368V10.4857C0 10.9884 0.364 11.4164 0.86 11.497C3.712 11.963 6.62133 11.963 9.47333 11.497C9.71338 11.4579 9.93171 11.3347 10.0893 11.1495C10.2468 10.9642 10.3333 10.7289 10.3333 10.4857V9.69368C10.3333 9.03064 10.0699 8.39476 9.6011 7.92592C9.13226 7.45708 8.49637 7.19368 7.83333 7.19368H7.60667C7.48333 7.19368 7.36067 7.21368 7.244 7.25102L6.66667 7.43968C5.69197 7.75784 4.64136 7.75784 3.66667 7.43968L3.08933 7.25102C2.97244 7.21298 2.85027 7.19363 2.72733 7.19368H2.5ZM11.3333 4.19368C12.3333 4.19368 10.6823 4.19368 10.3333 4.19368C9.98438 4.19368 10.3333 4.19368 11.3333 4.19368H12.5C12.6326 4.19368 12.7598 4.24636 12.8536 4.34013C12.9473 4.4339 13 4.56108 13 4.69368C13 4.82629 12.9473 4.95347 12.8536 5.04724C12.7598 5.14101 12.6326 5.19368 12.5 5.19368H11.3333C11.0417 5.19368 10.8333 5.19368 11.3333 5.19368C10.9375 5.19368 10.9425 5.19368 10.8099 5.19368C10.6773 5.19368 10.6979 5.19368 10.6667 5.19368C10.6667 5.19368 10.6667 5.19368 10.3333 5.19368H9.16667C9.03406 5.19368 8.90688 5.14101 8.81311 5.04724C8.71934 4.95347 8.66667 4.82629 8.66667 4.69368C8.66667 4.56108 8.71934 4.4339 8.81311 4.34013C8.90688 4.24636 9.03406 4.19368 9.16667 4.19368H10.3333C10.6823 4.19368 11.1869 4.19368 10.3333 4.19368C9.98438 4.19368 10.3333 4.19368 11.3333 4.19368Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_279_2237">
                        <rect width="13" height="13" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </BlueButton>
              ))}
          </div>
          <Line />
        </div>
        <div className={styles.posts}>
          <PageTitle pageTitle="Посты" marginBottom={20} marginTop={15} />
          {!filteredPosts.length ? (
            <NullResultsBlock text="Список постов пуст" />
          ) : (
            filteredPosts.map((post) => (
              <Post
                {...post}
                key={post?.postId}
                handleDelete={(postId: string) =>
                  setPosts((posts) => [
                    ...posts.filter((post) => post?.postId !== postId),
                  ])
                }
                handlePin={(postId) =>
                  post?.postId === postId && setPinnedPost(post)
                }
                pinned={post?.postId === pinnedPost?.postId}
                innerRef={ref}
              />
            ))
          )}
          {isLoading && (
            <div className={styles.loadSpinner}>
              <InfinitySpin width="200" color="#181F92" />
            </div>
          )}
        </div>
        <Dialog
          open={isChangeAvatarOpen}
          onClose={() => setIsChangeAvatarOpen(false)}
          fullWidth
          maxWidth="sm"
          style={{ zIndex: 10000 }}
        >
          <DialogContent className={styles.dialogContainer}>
            <DialogContentText className={styles.editAvatarContainer}>
              <h2 className={styles.editAvatarTitle}>Редактирование аватара</h2>
              {preview && (
                <img
                  className={styles.avatar}
                  src={preview}
                  alt="image preview"
                />
              )}
              <BlueButton
                text="Отменить"
                handleClick={onCloseImage}
                color="secondary"
              />
              <BlueButton
                text="Сохранить"
                handleClick={onSubmitAttachedImage}
                color="green"
                disabled={isUploading || !preview}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isEditProfileVisible}
          onClose={() => setIsEditProfileVisible(false)}
          fullWidth
          maxWidth="sm"
          style={{ zIndex: 10000 }}
        >
          <DialogContent className={styles.dialogContainer}>
            <DialogContentText className={styles.editAvatarContainer}>
              <h2 className={styles.editAvatarTitle}>Редактирование профиля</h2>
              <EditProfileForm
                name={localName}
                surname={localSurname}
                birthDate={new Date(localBirthDate)}
                handleSubmit={onEditProfile}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
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
