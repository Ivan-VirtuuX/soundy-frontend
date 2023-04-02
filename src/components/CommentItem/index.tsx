import React from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { ILike, IUser } from "@/api/types";
import { Api } from "@/api/index";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { KebabMenu } from "@/components/ui/KebabMenu";
import { Like } from "@/components/ui/Like";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { isUrl } from "@/utils/isUrl";

import { useInterval } from "@/hooks/useInterval";
import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import styles from "./CommentItem.module.scss";

interface CommentItemProps {
  postId: string;
  commentId: string;
  author: IUser;
  createdAt: Date;
  text: string;
  likes: ILike[];
  handleDeleteComment: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  commentId,
  author,
  createdAt,
  text,
  likes,
  handleDeleteComment,
}) => {
  const [likesCount, setLikesCount] = React.useState(likes?.length);

  const kebabMenuRef = React.useRef(null);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  const { convertedDate } = useInterval(5000, createdAt);

  const { isVisible, onMouseOver, onMouseLeave } =
    useTransitionOpacity(kebabMenuRef);

  const onClickLike = async () => {
    try {
      setLikesCount((likesCount) => likesCount + 1);

      await Api().comment.addCommentLike(commentId, postId);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickDislike = async (likeId: string) => {
    try {
      setLikesCount((likesCount) => likesCount - 1);

      await Api().comment.removeCommentLike(commentId, likeId);
    } catch (err) {
      console.warn(err);
    }
  };

  const onDeleteComment = async () => {
    try {
      await Api().comment.remove(commentId);

      handleDeleteComment(commentId);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div
      className={styles.container}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {author?.avatarUrl ? (
        <img
          width={40}
          height={40}
          className={styles.avatar}
          src={author?.avatarUrl}
          alt="avatar"
          onClick={() => router.push(`/users/${author?.userId}`)}
        />
      ) : (
        <EmptyAvatar
          handleClick={() => router.push(`/users/${author?.userId}`)}
        />
      )}
      <div className={styles.content}>
        <div className={styles.head}>
          <div className={styles.infoBlock}>
            <span
              className={styles.name}
              onClick={() => router.push(`/users/${author?.userId}`)}
            >
              {author?.name}
            </span>
            <span
              className={styles.surname}
              onClick={() => router.push(`/users/${author?.userId}`)}
            >
              {author?.surname}
            </span>
            <span className={styles.createdAt}>{convertedDate}</span>
          </div>
          <div className={styles.rightSide}>
            {isVisible && (
              <KebabMenu
                handleDelete={onDeleteComment}
                innerRef={kebabMenuRef}
              />
            )}
            <Like
              isLiked={likes?.some(
                (like) => like?.author?.userId === userData?.id
              )}
              handleClickLike={onClickLike}
              handleClickDislike={onClickDislike}
              likesCount={likesCount > 0 && likesCount}
              size="small"
              likeId={
                likes?.find((like) => like?.author?.userId === userData?.id)
                  ?.likeId
              }
            />
          </div>
        </div>
        {isUrl(text) ? (
          <Image
            className={styles.commentImage}
            width={200}
            height={200}
            src={text}
            quality={100}
            alt="comment image"
          />
        ) : (
          <p className={styles.text}>{text}</p>
        )}
      </div>
    </div>
  );
};
