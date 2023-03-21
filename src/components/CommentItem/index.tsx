import React from "react";
import styles from "./CommentItem.module.scss";
import { ILike, IUser } from "@/api/types";
import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { Like } from "@/components/ui/Like";
import { Api } from "@/api/index";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";
import { isUrl } from "@/utils/isUrl";
import Image from "next/image";

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

  console.log(text, likes);

  return (
    <div className={styles.container}>
      {author?.avatarUrl ? (
        <img
          width={40}
          height={40}
          className={styles.avatar}
          src={author?.avatarUrl}
          alt="avatar"
        />
      ) : (
        <EmptyAvatar />
      )}
      <div className={styles.content}>
        <div className={styles.head}>
          <div>
            <span className={styles.name}>{author?.name}</span>
            <span className={styles.surname}>{author?.surname}</span>
            <span className={styles.createdAt}>
              {new Date(createdAt)?.toLocaleDateString("ru-Ru")}
            </span>
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
