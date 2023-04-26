import React from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { IComment, ILike } from "@/api/types";
import { Api } from "@/api";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { useInterval } from "@/hooks/useInterval";
import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import styles from "./CommentItem.module.scss";
import { KebabMenu } from "@/components/ui/KebabMenu";
import { Like } from "@/components/ui/Like";

interface CommentItemProps extends IComment {
  handleDeleteComment: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  commentId,
  author,
  createdAt,
  content,
  likes,
  handleDeleteComment,
}) => {
  const [likesCount, setLikesCount] = React.useState(0);
  const [localLikes, setLocalLikes] = React.useState<ILike[]>([]);

  const kebabMenuRef = React.useRef(null);

  const userData = useAppSelector(selectUserData);

  const router = useRouter();

  const { convertedDate } = useInterval(5000, createdAt);

  const { isVisible, onMouseOver, onMouseLeave } =
    useTransitionOpacity(kebabMenuRef);

  const onClickLike = async () => {
    try {
      setLikesCount((likesCount) => likesCount + 1);

      const data = await Api().comment.addCommentLike(commentId, postId);

      setLocalLikes([...localLikes, data]);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickDislike = async (likeId: string) => {
    try {
      setLikesCount((likesCount) => likesCount - 1);

      await Api().comment.removeCommentLike(commentId, likeId);

      setLocalLikes([...localLikes.filter((like) => like.likeId !== likeId)]);
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

  React.useEffect(() => {
    setLocalLikes(likes);
    setLikesCount(likes?.length);
  }, [likes]);

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
            <div className={styles.nameSurnameBlock}>
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
            </div>
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
              isLiked={localLikes?.some(
                (like) => like?.author?.userId === userData.userId
              )}
              likeId={
                localLikes?.find(
                  (like) => like?.author?.userId === userData.userId
                )?.likeId
              }
              handleClickLike={onClickLike}
              handleClickDislike={onClickDislike}
              likesCount={likesCount > 0 && likesCount}
              size="small"
            />
          </div>
        </div>
        {content?.images?.length !== 0 && (
          <div className={styles.commentImagesBlock}>
            {content?.images?.map((img, index) => (
              <Image
                key={index}
                className={styles.commentImage}
                width={200}
                height={200}
                src={img.url}
                quality={100}
                alt="comment image"
              />
            ))}
          </div>
        )}
        {content?.text && <p className={styles.text}>{content?.text}</p>}
      </div>
    </div>
  );
};
