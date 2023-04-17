import React, { FormEvent, Ref } from "react";
import { useInView } from "react-intersection-observer";

import { useRouter } from "next/router";

import { IconButton, Tooltip, Typography } from "@mui/material";

import { Line } from "../ui/Line";

import { Api } from "@/api/index";
import { IComment, IPost } from "@/api/types";
import { CloudinaryApi } from "@/api/CloudinaryApi";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { KebabMenu } from "@/components/ui/KebabMenu";
import { Like } from "@/components/ui/Like";
import { Comment } from "@/components/ui/Comment";
import { Views } from "@/components/ui/Views";
import { CommentItem } from "@/components/CommentItem";
import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { PinIcon } from "@/components/ui/Icons/PinIcon";
import { InputField } from "@/components/InputField";
import { HideDetailsIcon } from "@/components/ui/Icons/HideDetailsIcon";

import { useInterval } from "@/hooks/useInterval";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import styles from "./Post.module.scss";

interface PostProps extends IPost {
  innerRef: Ref<HTMLDivElement>;
  handleDelete?: (postId: string) => void;
  handlePin?: (postId: string) => void;
  handleUnpin?: (postId: string) => void;
  menuHidden?: boolean;
}

const Index: React.FC<PostProps> = ({
  postId,
  author,
  body,
  createdAt,
  likes,
  views,
  innerRef,
  handleDelete,
  pinned,
  handlePin,
  handleUnpin,
  menuHidden,
  comments,
}) => {
  const [attachedImagesFormData, setAttachedImagesFormData] = React.useState<
    FormData[]
  >([]);
  const [isCommentInputVisible, setIsCommentInputVisible] =
    React.useState(false);
  const [isShowComments, setIsShowComments] = React.useState(false);
  const [attachedImages, setAttachedImages] = React.useState<File[]>([]);
  const [localComments, setLocalComments] =
    React.useState<IComment[]>(comments);
  const [isUploading, setIsUploading] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(likes?.length);
  const [viewsCount, setViewsCount] = React.useState(views?.length);
  const [isPinned, setIsPinned] = React.useState(false);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState("");
  const [isView, setIsView] = React.useState(false);

  const userData = useAppSelector(selectUserData);

  const { asPath } = useRouter();

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { convertedDate } = useInterval(5000, createdAt);

  const [parent] = useAutoAnimate();

  const onDeletePost = async () => {
    try {
      await Api().post.delete(postId);

      handleDelete(postId);
    } catch (err) {
      console.warn(err);
    }
  };

  const submitComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (attachedImagesFormData.length !== 0 && message) {
        setIsUploading(true);

        const data = await onSubmitAttachedImages();

        if (data.length !== 0) {
          await setIsShowComments(true);

          await commentInputRef?.current?.scrollIntoView({ block: "center" });

          setIsUploading(true);

          const comment = await Api().comment.addComment({
            postId,
            content: { text: message, images: data },
          });

          setLocalComments([...localComments, comment]);
          setAttachedImagesFormData([]);
          setPreviews([]);
          setMessage("");
        }
      } else {
        if (attachedImagesFormData.length !== 0) {
          setIsUploading(true);

          const data = await onSubmitAttachedImages();

          if (data.length !== 0) {
            await setIsShowComments(true);

            await commentInputRef?.current?.scrollIntoView({
              block: "center",
            });

            setIsUploading(true);

            const comment = await Api().comment.addComment({
              postId,
              content: { images: data },
            });

            setLocalComments([...localComments, comment]);
            setAttachedImagesFormData([]);
            setPreviews([]);
            setMessage("");
          }
        }
        if (message) {
          setIsUploading(true);

          await setIsShowComments(true);

          await commentInputRef?.current?.scrollIntoView({ block: "center" });

          setIsUploading(true);

          const comment = await Api().comment.addComment({
            postId,
            content: { text: message },
          });

          setLocalComments([...localComments, comment]);

          setIsUploading(false);

          setMessage("");
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsUploading(false);
    }
  };

  const onClickLike = React.useCallback(async () => {
    try {
      setLikesCount((likesCount) => likesCount + 1);

      await Api().post.addLike(postId);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const onClickDislike = React.useCallback(async (likeId: string) => {
    try {
      setLikesCount((likesCount) => likesCount - 1);

      await Api().post.removeLike(postId, likeId);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const onClickCommentIcon = async () => {
    await setIsCommentInputVisible(true);

    await commentInputRef?.current?.focus();
  };

  const onPinPost = async () => {
    try {
      await Api().post.togglePin(postId);

      setIsPinned(!isPinned);

      handlePin(postId);
    } catch (err) {
      console.warn(err);
    }
  };

  const onUnpinPost = async () => {
    try {
      await Api().post.togglePin(postId);

      setIsPinned(!isPinned);

      handleUnpin(postId);
    } catch (err) {
      console.warn(err);
    }
  };

  const onSubmitAttachedImages = async () => {
    try {
      setIsUploading(true);

      const promises = [];

      for (let i: number = 0; i < attachedImagesFormData.length; i++) {
        const { data } = await CloudinaryApi().cloudinary.changeImage(
          attachedImagesFormData[i]
        );

        promises.push(data);
      }

      await Promise.all(promises);

      setIsUploading(false);

      return promises;
    } catch (err) {
      console.warn(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAttachedImages = (
    images: File[],
    imagesFormData: FormData[]
  ) => {
    setAttachedImages([...attachedImages.concat(images)]);
    setAttachedImagesFormData([
      ...attachedImagesFormData.concat(imagesFormData),
    ]);
  };

  const onRemoveAttachedImage = (preview) => {
    setAttachedImages([]);
    setAttachedImagesFormData([]);
    setPreviews([...previews.filter((img) => img !== preview)]);
  };

  React.useEffect(() => {
    (async () => {
      try {
        const data = await Api().comment.getAll(postId);

        data.length > 0 && setIsCommentInputVisible(true);

        setLocalComments(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, []);

  React.useEffect(() => {
    pinned && setIsPinned(true);
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        if (
          (inView &&
            !isView &&
            !views.find((user) => user.userId === userData.userId)) ||
          (inView && views.length === 0)
        ) {
          await setIsView(true);

          setViewsCount(views.length + 1);

          await Api().post.addView(postId);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [inView]);

  return (
    <div className={styles.container} ref={innerRef}>
      <div className={styles.head}>
        <div className={styles.headLeftSide}>
          {author?.avatarUrl ? (
            <img
              className={styles.avatar}
              src={author?.avatarUrl}
              alt="avatar"
              width={40}
              height={40}
              onClick={() => router.push(`/users/${author?.userId}`)}
            />
          ) : (
            <EmptyAvatar
              handleClick={() => router.push(`/users/${author?.userId}`)}
            />
          )}
          <div className={styles.userInfoBlock}>
            <div className={styles.userInfo}>
              <div onClick={() => router.push(`/users/${author?.userId}`)}>
                <span className={styles.name}>{author?.name}</span>
                <span className={styles.surname}>{author?.surname}</span>
                <span className={styles.login}>{author?.login}</span>
              </div>
              {pinned && asPath !== "/posts" && (
                <PinIcon className={styles.pinIcon} />
              )}
            </div>
            <span className={styles.createdAt}>{convertedDate}</span>
          </div>
        </div>
        {!menuHidden && author?.userId === userData.userId && (
          <KebabMenu
            isPinned={pinned}
            handleDelete={onDeletePost}
            handlePin={onPinPost}
            handleUnpin={onUnpinPost}
            isVisiblePin={asPath.includes("/users")}
          />
        )}
      </div>
      <div className={styles.content}>
        {body.map((obj) => (
          <Typography
            key={obj?.id}
            dangerouslySetInnerHTML={{ __html: obj.data.text }}
            className={styles.text}
          />
        ))}
        {body?.some((obj) => obj.type === "image") && (
          <div
            className={styles.imagesBlock}
            style={{
              gridTemplateColumns:
                body.filter((obj) => obj.type === "image").length >= 2
                  ? "1fr 1fr"
                  : "1fr",
            }}
          >
            {body.map(
              (obj) =>
                obj?.data?.file?.url && (
                  <img
                    key={obj?.id}
                    className={styles.image}
                    src={obj.data.file.url}
                    alt="post image"
                  />
                )
            )}
          </div>
        )}
      </div>
      <div className={styles.actions} ref={ref}>
        <Like
          handleClickLike={onClickLike}
          handleClickDislike={onClickDislike}
          likesCount={likesCount > 0 && likesCount}
          isLiked={likes?.some(
            (like) => like?.author?.userId === userData.userId
          )}
          likeId={
            likes?.find((like) => like?.author?.userId === userData.userId)
              ?.likeId
          }
        />
        <Comment
          commentsCount={localComments.length}
          handleClick={onClickCommentIcon}
        />
        <Views viewsCount={viewsCount} />
      </div>
      {localComments.length !== 0 && isShowComments && (
        <div className={styles.commentsBlock}>
          <div className={styles.commentsBlockHead}>
            <h2 className={styles.commentsBlockTitle}>Комментарии</h2>
            <Tooltip title="Скрыть" arrow placement="top">
              <IconButton
                color="primary"
                size="small"
                onClick={() => setIsShowComments(false)}
              >
                <HideDetailsIcon />
              </IconButton>
            </Tooltip>
          </div>
          <ul ref={parent}>
            {localComments?.map((comment) => (
              <li key={comment.commentId}>
                <CommentItem
                  {...comment}
                  handleDeleteComment={(commentId) =>
                    setLocalComments([
                      ...localComments.filter(
                        (comment) => comment.commentId !== commentId
                      ),
                    ])
                  }
                />
                {localComments[localComments.length - 1] !== comment && (
                  <Line />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {localComments[0] && !isShowComments && (
        <div className={styles.comment}>
          <CommentItem
            handleDeleteComment={(commentId) =>
              setLocalComments([
                ...localComments.filter(
                  (comment) => comment.commentId !== commentId
                ),
              ])
            }
            {...localComments[0]}
          />
        </div>
      )}
      {localComments.length > 1 && !isShowComments && (
        <button
          onClick={() => setIsShowComments(true)}
          className={styles.showCommentsButton}
        >
          Показать все
        </button>
      )}
      {isCommentInputVisible && (
        <InputField
          innerRef={commentInputRef}
          text={message}
          handleChangeText={(text) => setMessage(text)}
          handleChangeAttachedImages={handleChangeAttachedImages}
          handleChangePreview={(preview) => setPreviews([...previews, preview])}
          handleRemoveAttachedImage={onRemoveAttachedImage}
          handleSubmit={submitComment}
          isUploading={isUploading}
          attachedImages={attachedImages}
          previews={previews}
        />
      )}
    </div>
  );
};

export const Post = React.memo(Index);
