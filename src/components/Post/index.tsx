import React, { FormEvent, Ref } from "react";

import Image from "next/image";

import { OutputData } from "@editorjs/editorjs";

import { IconButton, Typography } from "@mui/material";

import { KebabMenu } from "@/components/UI/KebabMenu";
import { Like } from "@/components/UI/Like";
import { Comment } from "@/components/UI/Comment";
import { Views } from "@/components/UI/Views";
import { CommentItem } from "@/components/CommentItem";
import { EmptyAvatar } from "@/components/UI/EmptyAvatar";

import { Line } from "../UI/Line";

import { Api } from "@/api/index";
import { IComment, ILike, IUser, ResponseUser } from "@/api/types";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import styles from "./Post.module.scss";
import { useInView } from "react-intersection-observer";
import { convertDate } from "@/utils/dateConverter";

interface PostProps {
  postId: string;
  author: ResponseUser;
  body: OutputData["blocks"];
  createdAt: Date;
  likes: ILike[];
  views: IUser[];
  comments: IComment[];
  innerRef: Ref<HTMLDivElement>;
  handleDelete: (postId: string) => void;
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
}) => {
  const [isShowComments, setIsShowComments] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [localComments, setLocalComments] = React.useState<IComment[]>([]);
  const [likesCount, setLikesCount] = React.useState(likes.length);
  const [viewsCount, setViewsCount] = React.useState(views.length);
  const [isCommentInputVisible, setIsCommentInputVisible] =
    React.useState(false);
  const [isView, setIsView] = React.useState(false);
  const [date, setDate] = React.useState(convertDate(new Date(createdAt)));
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const userData = useAppSelector(selectUserData);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const intervalCallback = React.useCallback(() => {
    setDate(convertDate(new Date(createdAt)));
  }, []);

  React.useEffect(() => {
    const timeout = setInterval(() => {
      setDate(convertDate(new Date(createdAt)));
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
    (async () => {
      try {
        if (
          (inView &&
            !isView &&
            views.some((user) => user.userId !== userData.id)) ||
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

  console.log(isSubmitting);

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

  return (
    <div className={styles.container} ref={innerRef}>
      <div className={styles.head}>
        <div className={styles.headLeftSide}>
          {author?.avatarUrl ? (
            <Image
              className={styles.avatar}
              src={author?.avatarUrl}
              alt="avatar"
            />
          ) : (
            <EmptyAvatar />
          )}
          <div className={styles.userInfoBlock}>
            <div className={styles.userInfo}>
              <span className={styles.name}>{author?.name}</span>
              <span className={styles.surname}>{author?.surname}</span>
              <span className={styles.login}>{author?.login}</span>
            </div>
            <span className={styles.createdAt}>{date}</span>
          </div>
        </div>
        {author?.userId === userData?.id && (
          <KebabMenu handleDelete={onDeletePost} />
        )}
      </div>
      <div className={styles.content}>
        {body.map((obj) => (
          <React.Fragment key={obj?.id}>
            <Typography
              dangerouslySetInnerHTML={{ __html: obj.data.text }}
              className={styles.text}
            />
            {obj.data.file?.url && (
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_58_1159)">
                      <path
                        d="M7.61906 10.4762L10.4762 6.66668L13.3333 10.9524V9.52382H17.1429V2.85715C17.1429 1.80668 16.2886 0.952393 15.2381 0.952393H2.85715C1.80668 0.952393 0.952393 1.80668 0.952393 2.85715V14.2857C0.952393 15.3362 1.80668 16.1905 2.85715 16.1905H10.4762V12.381H3.80954L6.66668 8.57144L7.61906 10.4762Z"
                        fill="#A9A9A9"
                      />
                      <path
                        d="M17.1428 11.4285H15.238V14.2856H12.3809V16.1904H15.238V19.0475H17.1428V16.1904H19.9999V14.2856H17.1428V11.4285Z"
                        fill="#A9A9A9"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_58_1159">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </IconButton>
              </div>
            </div>
            <IconButton
              disabled={isSubmitting}
              type="submit"
              size="large"
              className={styles.sendCommentButton}
            >
              <svg
                width="23"
                height="23"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.03383 0.0754501C0.914254 0.0156447 0.780295 -0.00940154 0.64719 0.00316034C0.514085 0.0157222 0.387177 0.065388 0.280903 0.146508C0.174628 0.227628 0.0932526 0.336946 0.0460335 0.462026C-0.00118556 0.587107 -0.012353 0.722929 0.0138017 0.854042L2.01814 7.7828C2.05551 7.91192 2.12856 8.02788 2.22889 8.11734C2.32922 8.2068 2.45276 8.26613 2.5853 8.28853L10.7141 9.64999C11.097 9.72571 11.097 10.2743 10.7141 10.35L2.5853 11.7115C2.45276 11.7339 2.32922 11.7932 2.22889 11.8827C2.12856 11.9721 2.05551 12.0881 2.01814 12.2172L0.0138017 19.146C-0.012353 19.2771 -0.00118556 19.4129 0.0460335 19.538C0.0932526 19.6631 0.174628 19.7724 0.280903 19.8535C0.387177 19.9346 0.514085 19.9843 0.64719 19.9968C0.780295 20.0094 0.914254 19.9844 1.03383 19.9246L19.6058 10.6386C19.7242 10.5792 19.8239 10.488 19.8935 10.3752C19.9631 10.2625 20 10.1325 20 10C20 9.86746 19.9631 9.73754 19.8935 9.62476C19.8239 9.51198 19.7242 9.4208 19.6058 9.36141L1.03383 0.0754501Z"
                  fill="#A9A9A9"
                />
              </svg>
            </IconButton>
          </div>
        </form>
      )}
    </div>
  );
};
