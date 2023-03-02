import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

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

import Image from "next/image";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { useRouter } from "next/router";

import styles from "./Users.module.scss";

const Users: NextPage<IUser> = ({
  id,
  login,
  name,
  surname,
  avatarUrl,
  birthDate,
}) => {
  const [page, setPage] = React.useState(1);
  const [newPosts, setNewPosts] = React.useState<IPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = React.useState(false);
  const [isEditProfileVisible, setIsEditProfileVisible] = React.useState(false);
  const [attachedImageFormData, setAttachedImageFormData] = React.useState([]);
  const [image, setImage] = React.useState<File>();
  const [attachedImage, setAttachedImage] = React.useState<File>();
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [avatar, setAvatar] = React.useState(avatarUrl);
  const [localName, setLocalName] = React.useState(name);
  const [localSurname, setLocalSurname] = React.useState(surname);
  const [localBirthDate, setLocalBirthDate] = React.useState(birthDate);
  const [pinned, setPinned] = React.useState("");
  const [pinnedPost, setPinnedPost] = React.useState<IPost>();

  const attachedImageRef = React.useRef(null);

  const router = useRouter();

  const { posts, setPosts } = usePosts(newPosts, page, pinnedPost);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const userData = useAppSelector(selectUserData);

  const { query } = useRouter();

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

  const onChangeImage = () => {
    attachedImageRef?.current?.click();
  };

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

  const onClickChangeAvatarButton = () => {
    onChangeImage();
  };

  const onEditProfile = (data: ChangeUserDataDto) => {
    setIsEditProfileVisible(false);
    setLocalName(data.name);
    setLocalSurname(data.surname);
    setLocalBirthDate(data.birthDate);
  };

  React.useEffect(() => {
    (async () => {
      if (posts.length >= 5) {
        try {
          if (inView) {
            setIsLoading(true);

            const data = await Api().post.getAll(page);

            setNewPosts(data);

            setPage((page) => page + 1);

            setIsLoading(false);
          }
        } catch (err) {
          console.warn(err);

          setIsLoading(false);
        }
      }
    })();
  }, [inView]);

  React.useEffect(() => {
    if (isSaveImage) {
      setIsChangeAvatarOpen(true);
    }
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

  // const filteredPosts = posts.filter(
  //   (post) => post?.author?.userId === query?.id
  // );

  const [filteredPosts, setFilteredPosts] = React.useState<IPost[]>([]);

  React.useEffect(() => {
    setFilteredPosts(
      posts.filter((post) => post?.author?.userId === query?.id)
    );
  }, []);

  function move(arr, old_index, new_index) {
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      var k = new_index - arr.length;
      while (k-- + 1) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  React.useEffect(() => {
    const postFiltered = posts.filter(
      (post) => post?.author?.userId === query?.id
    );

    setFilteredPosts(move(posts, filteredPosts.indexOf(pinnedPost), 0));
  }, [pinned, pinnedPost]);

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
                {!avatarUrl ? (
                  <EmptyAvatar width={150} />
                ) : (
                  <Image
                    className={styles.avatar}
                    src={avatar}
                    alt="avatar"
                    width={150}
                    height={150}
                    quality={100}
                  />
                )}
                {userData?.id === id && (
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
              <div className={styles.friendsBlockHead}>
                <span className={styles.friendsBlockTitle}>Друзья</span>
                <span className={styles.friendsBlockFriendsCount}> 12</span>
              </div>
              <FriendsList />
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
          </div>
          <Line />
        </div>
        <div className={styles.posts}>
          <PageTitle pageTitle="Посты" marginBottom={20} marginTop={15} />
          {posts.filter((post) => post?.author?.userId === query?.id).length ===
          0 ? (
            <NullResultsBlock text="Список постов пуст" />
          ) : (
            filteredPosts.map((post) => (
              <Post
                handleDelete={(postId: string) =>
                  setPosts((posts) => [
                    ...posts.filter((post) => post.postId !== postId),
                  ])
                }
                pinned={pinnedPost?.postId === post.postId}
                innerRef={ref}
                {...post}
                key={post.postId}
                handlePin={(postId) =>
                  post.postId === postId && setPinnedPost(post)
                }
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
              <img
                className={styles.avatar}
                src={preview}
                alt="image preview"
              />
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
