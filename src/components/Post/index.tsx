import React, { FormEvent, Ref } from "react";
import { useInView } from "react-intersection-observer";

import { useRouter } from "next/router";

import { IconButton, Typography } from "@mui/material";

import { Line } from "../UI/Line";

import { Api } from "@/api/index";
import { IComment, IPost } from "@/api/types";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { convertDate } from "@/utils/dateConverter";

import { KebabMenu } from "@/components/UI/KebabMenu";
import { Like } from "@/components/UI/Like";
import { Comment } from "@/components/UI/Comment";
import { Views } from "@/components/UI/Views";
import { CommentItem } from "@/components/CommentItem";
import { EmptyAvatar } from "@/components/UI/EmptyAvatar";
import { PinIcon } from "@/components/UI/Icons/PinIcon";
import { SendIcon } from "@/components/UI/Icons/SendIcon";

import styles from "./Post.module.scss";
import { AttachImagePopup } from "@/components/AttachImagePopup";
import Image from "next/image";
import { CloudinaryApi } from "@/api/CloudinaryApi";

interface PostProps extends IPost {
  innerRef: Ref<HTMLDivElement>;
  handleDelete?: (postId: string) => void;
  handlePin?: (postId: string) => void;
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
  menuHidden,
}) => {
  const [isCommentInputVisible, setIsCommentInputVisible] =
    React.useState(false);
  const [attachedImage, setAttachedImage] = React.useState<File>();
  const [attachedImageFormData, setAttachedImageFormData] =
    React.useState<FormData>();
  const [isShowComments, setIsShowComments] = React.useState(false);
  const [localComments, setLocalComments] = React.useState<IComment[]>([]);
  const [attachedImageUrl, setAttachedImageUrl] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(likes?.length);
  const [viewsCount, setViewsCount] = React.useState(views?.length);
  const [isPinned, setIsPinned] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isView, setIsView] = React.useState(false);

  const [date, setDate] = React.useState(convertDate(new Date(createdAt)));

  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const userData = useAppSelector(selectUserData);

  const { asPath } = useRouter();

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const router = useRouter();

  const intervalCallback = React.useCallback(() => {
    setDate(convertDate(new Date(createdAt)));
  }, []);

  React.useEffect(() => {
    const timeout = setInterval(() => {
      const newDate = convertDate(new Date(createdAt));

      if (
        newDate.split(" ")[1].includes("секунд") ||
        newDate === "2 минуты назад"
      ) {
        setDate(newDate);
      } else {
        clearInterval(timeout);
      }
    }, 5000);

    return () => clearInterval(timeout);
  }, [intervalCallback]);

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
            !views.find((user) => user.userId === userData.id)) ||
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
  }, [attachedImage]);

  const onDeletePost = async () => {
    try {
      await Api().post.delete(postId);

      handleDelete(postId);
    } catch (err) {
      console.warn(err);
    }
  };

  const submitComment = React.useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log(attachedImageFormData);

      try {
        if (attachedImageFormData) {
          const { secure_url } = await onSubmitAttachImage();

          if (secure_url) {
            await setIsShowComments(true);

            await commentInputRef?.current?.scrollIntoView({ block: "center" });

            setIsSubmitting(true);

            setIsUploading(true);

            setIsUploading(false);

            const comment = await Api().comment.addComment({
              postId,
              author: userData?.userId,
              text: secure_url,
            });

            setAttachedImageFormData(null);
            setAttachedImage(null);

            setPreview("");

            setLocalComments([...localComments, comment]);
            setIsSubmitting(false);
          }
        }
        if (message) {
          await setIsShowComments(true);

          await commentInputRef?.current?.scrollIntoView({ block: "center" });

          setIsSubmitting(true);

          const comment = await Api().comment.addComment({
            postId,
            author: userData?.userId,
            text: message,
          });

          setLocalComments([...localComments, comment]);
          setIsSubmitting(false);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setMessage("");
        setIsSubmitting(false);
      }
    },
    [attachedImageFormData, localComments, message, postId, userData?.userId]
  );

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
      await Api().post.addPin(postId);

      setIsPinned(!isPinned);

      handlePin(postId);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleChangeAttachedImage = (image: File, imageFormData: FormData) => {
    setAttachedImage(image);
    setAttachedImageFormData(imageFormData);
  };

  const onSubmitAttachImage = async () => {
    try {
      setIsUploading(true);

      const { data } = await CloudinaryApi().cloudinary.changeImage(
        attachedImageFormData
      );

      setIsUploading(false);

      return data;
    } catch (err) {
      console.warn(err);

      alert("Update image error");
    } finally {
      setIsSaveImage(false);
      setIsUploading(false);
    }
  };

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
            <span className={styles.createdAt}>{date}</span>
          </div>
        </div>
        {!menuHidden && author?.userId === userData?.id && (
          <KebabMenu
            isPinned={pinned}
            handleDelete={onDeletePost}
            handlePin={onPinPost}
            isVisiblePin={asPath.includes("/users")}
          />
        )}
      </div>
      <div className={styles.content}>
        {body.map((obj) => (
          <React.Fragment key={obj?.id}>
            <Typography
              dangerouslySetInnerHTML={{ __html: obj.data.text }}
              className={styles.text}
            />
            {obj?.data?.file?.url && (
              <img
                className={styles.image}
                src={obj.data.file.url}
                alt="post image"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className={styles.actions} ref={ref}>
        <Like
          handleClickLike={onClickLike}
          handleClickDislike={onClickDislike}
          likesCount={likesCount}
          isLiked={likes?.some(
            (like) => like?.author?.userId === userData?.userId
          )}
          likeId={
            likes?.find((like) => like?.author?.userId === userData?.userId)
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
          <h2 className={styles.commentsBlockTitle}>Комментарии</h2>
          {localComments?.map((comment) => (
            <React.Fragment key={comment.commentId}>
              <CommentItem {...comment} />
              {localComments[localComments.length - 1] !== comment && <Line />}
            </React.Fragment>
          ))}
        </div>
      )}
      {localComments[0] && !isShowComments && (
        <div className={styles.comment}>
          <CommentItem {...localComments[0]} />
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
        <form onSubmit={submitComment}>
          {preview && (
            <Image
              width={100}
              height={100}
              quality={100}
              className={styles.preview}
              src={preview}
              alt="image preview"
            />
          )}
          <div className={styles.commentInputFieldBlock}>
            <div className={styles.commentInputField}>
              <div className={styles.commentInputFieldContainer}>
                <input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setMessage(e.target.value)
                  }
                  value={message}
                  ref={commentInputRef}
                  type="text"
                  placeholder="Cообщение"
                />
                <AttachImagePopup
                  className={styles.attachImageButton}
                  handleChangeAvatar={(imageUrl) =>
                    setAttachedImageUrl(imageUrl)
                  }
                  handleChangeAttachedImage={handleChangeAttachedImage}
                />
              </div>
            </div>
            <IconButton
              disabled={isSubmitting || isUploading}
              type="submit"
              size="large"
              className={styles.sendCommentButton}
            >
              <SendIcon />
            </IconButton>
          </div>
        </form>
      )}
    </div>
  );
};

export const Post = React.memo(Index);
