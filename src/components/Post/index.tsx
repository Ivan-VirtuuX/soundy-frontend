import React, { FormEvent, Ref } from "react";
import { useInView } from "react-intersection-observer";

import { useRouter } from "next/router";

import { IconButton, Typography } from "@mui/material";

import { KebabMenu } from "@/components/UI/KebabMenu";
import { Like } from "@/components/UI/Like";
import { Comment } from "@/components/UI/Comment";
import { Views } from "@/components/UI/Views";
import { CommentItem } from "@/components/CommentItem";
import { EmptyAvatar } from "@/components/UI/EmptyAvatar";

import { Line } from "../UI/Line";

import { Api } from "@/api/index";
import { IComment, IPost } from "@/api/types";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { convertDate } from "@/utils/dateConverter";

import styles from "./Post.module.scss";
import { PinIcon } from "@/components/UI/Icons/PinIcon";
import { AttachImageIcon } from "@/components/UI/Icons/AttachImageIcon";
import { SendIcon } from "@/components/UI/Icons/SendIcon";

interface PostProps extends IPost {
  innerRef: Ref<HTMLDivElement>;
  handleDelete: (postId: string) => void;
  handlePin?: (postId: string) => void;
}

export const Post: React.FC<PostProps> = ({
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
}) => {
  const [isShowComments, setIsShowComments] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [localComments, setLocalComments] = React.useState<IComment[]>([]);
  const [likesCount, setLikesCount] = React.useState(likes?.length);
  const [viewsCount, setViewsCount] = React.useState(views?.length);
  const [isCommentInputVisible, setIsCommentInputVisible] =
    React.useState(false);
  const [isView, setIsView] = React.useState(false);
  const [date, setDate] = React.useState(convertDate(new Date(createdAt)));

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPinned, setIsPinned] = React.useState(false);

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

      if (newDate.split(" ")[1].includes("секунд")) {
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
  };

  const onClickLike = async () => {
    try {
      setLikesCount((likesCount) => likesCount + 1);

      await Api().post.addLike(postId);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickDislike = async (likeId: string) => {
    try {
      setLikesCount((likesCount) => likesCount - 1);

      await Api().post.removeLike(postId, likeId);
    } catch (err) {
      console.warn(err);
    }
  };

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
        {author?.userId === userData?.id && (
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
                <IconButton size="small" className={styles.attachImageButton}>
                  <AttachImageIcon />
                </IconButton>
              </div>
            </div>
            <IconButton
              disabled={isSubmitting}
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
