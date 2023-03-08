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
import { CameraIcon } from "@/components/UI/Icons/CameraIcon";
import { EditUserIcon } from "@/components/UI/Icons/EditUserIcon";
import { MessageIcon } from "@/components/UI/Icons/MessageIcon";
import { PencilIcon } from "@/components/UI/Icons/PencilIcon";
import { AddUserIcon } from "@/components/UI/Icons/AddUserIcon";
import { CrossIcon } from "@/components/UI/Icons/CrossIcon";
import { DeleteUserIcon } from "@/components/UI/Icons/DeleteUserIcon";

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
  const [isLoadingUserAction, setIsLoadingUserAction] = React.useState(false);
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
      setIsLoadingUserAction(true);

      await Api().user.addFriendRequests(query?.id);

      setIsAddFriend(true);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  const deleteFriend = async () => {
    try {
      setIsLoadingUserAction(true);

      await Api().user.deleteFriend(userData?.id, query?.id);

      setIsDeleteFriend(true);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickCancel = async () => {
    try {
      setIsLoadingUserAction(true);

      await Api().user.cancelFriendRequest(userData?.id, query?.id);

      setIsAddFriend(false);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    (async () => {
      if (posts.length >= 4) {
        try {
          if (inView && posts.length) {
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
      setLocalName(name);
      setLocalSurname(surname);
      setLocalBirthDate(birthDate);
      setAvatar(avatarUrl);

      try {
        const data = await Api().post.getPinnedPost(query?.id);

        if (data[0]) setPinnedPost(data[0]);
      } catch (err) {
        console.warn(err);
      }
    })();
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

  React.useEffect(() => {
    friendRequests.find((user) => user.userId === userData?.id)
      ? setIsAddFriend(true)
      : setIsAddFriend(false);
  }, []);

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
                      size="large"
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
                      <CameraIcon />
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
                <EditUserIcon />
              </BlueButton>
            )}
            {userData?.id !== query?.id && (
              <BlueButton size="sm" text="Сообщение">
                <MessageIcon width={15} height={15} color="white" />
              </BlueButton>
            )}
            {userData?.id === query?.id && (
              <BlueButton
                handleClick={() => router.push("/write")}
                size="sm"
                text="Создать пост"
              >
                <PencilIcon />
              </BlueButton>
            )}
            {friends.find((friend) => friend.userId === userData?.id) &&
            !isDeleteFriend ? (
              <BlueButton
                size="sm"
                text="Удалить"
                handleClick={deleteFriend}
                disabled={isLoadingUserAction}
              >
                <DeleteUserIcon />
              </BlueButton>
            ) : query?.id !== userData?.id && isAddFriend ? (
              <BlueButton
                handleClick={onClickCancel}
                size="sm"
                text="Отклонить"
                color="primary"
                disabled={isLoadingUserAction}
              >
                <CrossIcon />
              </BlueButton>
            ) : (
              query?.id !== userData?.id &&
              !friends.find((friend) => friend.userId === query?.id) &&
              !isAddFriend && (
                <BlueButton
                  size="sm"
                  text="Добавить"
                  handleClick={addFriend}
                  disabled={isLoadingUserAction}
                >
                  <AddUserIcon />
                </BlueButton>
              )
            )}
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
