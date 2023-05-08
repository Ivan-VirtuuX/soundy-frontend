import React from "react";
import Link from "next/link";

import { IComment, ILike } from "@/api/types";
import { Api } from "@/api";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { useInterval } from "@/hooks/useInterval";
import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { KebabMenu } from "@/components/ui/KebabMenu";
import { Like } from "@/components/ui/Like";
import { CommentItemSkeleton } from "@/components/CommentItem/CommentItem.skeleton";

import styles from "./CommentItem.module.scss";

interface CommentItemProps extends IComment {
  handleDeleteComment: (commentId: string, userId: string) => void;
  isLoading?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  commentId,
  author,
  createdAt,
  content,
  likes,
  handleDeleteComment,
  isLoading,
}) => {
  const [expandedImageUrl, setExpandedImageUrl] = React.useState("");
  const [isVisibleExpandedImage, setIsVisibleExpandedImage] =
    React.useState(false);
  const [likesCount, setLikesCount] = React.useState(0);
  const [localLikes, setLocalLikes] = React.useState<ILike[]>([]);

  const kebabMenuRef = React.useRef(null);

  const userData = useAppSelector(selectUserData);

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

      handleDeleteComment(commentId, author.userId);
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    setLocalLikes(likes);
    setLikesCount(likes?.length);
  }, [likes]);

  if (isLoading) {
    return <CommentItemSkeleton />;
  }

  return (
    <>
      <div
        className={styles.container}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        {author?.avatarUrl ? (
          <Link href={`/users/${author?.userId}`}>
            <img
              width={40}
              height={40}
              className={styles.avatar}
              src={author?.avatarUrl}
              alt="avatar"
            />
          </Link>
        ) : (
          <Link href={`/users/${author?.userId}`}>
            <EmptyAvatar />
          </Link>
        )}
        <div className={styles.content}>
          <div className={styles.head}>
            <div className={styles.infoBlock}>
              <Link href={`/users/${author?.userId}`}>
                <div className={styles.nameSurnameBlock}>
                  <span className={styles.name}>{author?.name}</span>
                  <span className={styles.surname}>{author?.surname}</span>
                </div>
              </Link>
              <span className={styles.createdAt}>{convertedDate}</span>
            </div>
            <div className={styles.rightSide}>
              {isVisible && userData?.userId === author?.userId && (
                <KebabMenu
                  handleDelete={onDeleteComment}
                  innerRef={kebabMenuRef}
                />
              )}
              <Like
                isLiked={localLikes?.some(
                  (like) => like?.author?.userId === userData?.userId
                )}
                likeId={
                  localLikes?.find(
                    (like) => like?.author?.userId === userData?.userId
                  )?.likeId
                }
                handleClickLike={onClickLike}
                handleClickDislike={onClickDislike}
                likesCount={likesCount > 0 && likesCount}
                size="small"
              />
            </div>
          </div>
          {expandedImageUrl && isVisibleExpandedImage && (
            <div
              className={styles.expandedImageBlock}
              onClick={() => setIsVisibleExpandedImage(false)}
            >
              <img
                className={styles.expandedImage}
                src={expandedImageUrl}
                alt="expanded image"
              />
            </div>
          )}
          {content?.images?.length !== 0 && (
            <div className={styles.commentImagesBlock}>
              {content?.images?.map((img, index) => (
                <img
                  key={index}
                  className={styles.commentImage}
                  width={200}
                  height={200}
                  src={img.url}
                  alt="comment image"
                  onClick={() => {
                    setExpandedImageUrl(img.url);
                    onMouseOver();
                    setIsVisibleExpandedImage(true);
                  }}
                />
              ))}
            </div>
          )}
          {content?.text && <p className={styles.text}>{content?.text}</p>}
        </div>
      </div>
    </>
  );
};
