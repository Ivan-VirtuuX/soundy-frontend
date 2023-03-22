import React from "react";

import Image from "next/image";

import { ILike, IUser } from "@/api/types";
import { Api } from "@/api/index";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { Like } from "@/components/ui/Like";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { isUrl } from "@/utils/isUrl";

import { useInterval } from "@/hooks/useInterval";

import styles from "./CommentItem.module.scss";
import { useRouter } from "next/router";

interface CommentItemProps {
  postId: string;
  commentId: string;
  author: IUser;
  createdAt: Date;
  text: string;
  likes: ILike[];
}

export const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  commentId,
  author,
  createdAt,
  text,
  likes,
}) => {
  const [likesCount, setLikesCount] = React.useState(likes?.length);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  const { convertedDate } = useInterval(5000, createdAt);

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

  return (
    <div className={styles.container}>
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
          <div onClick={() => router.push(`/users/${author?.userId}`)}>
            <span className={styles.name}>{author?.name}</span>
            <span className={styles.surname}>{author?.surname}</span>
            <span className={styles.createdAt}>{convertedDate}</span>
          </div>
          <Like
            isLiked={likes?.some(
              (like) => like?.author?.userId === userData?.id
            )}
            handleClickLike={onClickLike}
            handleClickDislike={onClickDislike}
            likesCount={likesCount}
            size="small"
            likeId={
              likes?.find((like) => like?.author?.userId === userData?.id)
                ?.likeId
            }
          />
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
