import React from "react";
import { InfinitySpin } from "react-loader-spinner";
import { useInView } from "react-intersection-observer";

import { useRouter } from "next/router";

import { PageTitle } from "@/components/ui/PageTitle";
import { NullResultsBlock } from "@/components/ui/NullResultsBlock";
import { Post } from "@/components/Post";

import { IPost } from "@/api/types";
import { Api } from "@/api/index";

import { usePosts } from "@/hooks/usePosts";

import styles from "./UserPosts.module.scss";

interface UserPostsProps {
  pinnedPost: IPost;
  handleChangePinnedPost: (post: IPost) => void;
}

export const UserPosts: React.FC<UserPostsProps> = ({
  pinnedPost,
  handleChangePinnedPost,
}) => {
  const [filteredPosts, setFilteredPosts] = React.useState<IPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newPosts, setNewPosts] = React.useState<IPost[]>([]);
  const [page, setPage] = React.useState(1);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const { query } = useRouter();

  const { posts } = usePosts(newPosts, page, pinnedPost, query?.id);

  const onDeletePost = (postId: string) => {
    pinnedPost?.postId === postId
      ? setFilteredPosts((filteredPosts) => [
          ...filteredPosts.filter((post) => post.postId !== pinnedPost?.postId),
        ])
      : setFilteredPosts((posts) => [
          ...posts.filter((post) => post?.postId !== postId),
        ]);
  };

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

          setFilteredPosts([
            ...filteredPosts
              .concat(data)
              .filter((post) => post.pinned !== true),
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [posts, query?.id]);

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

  return (
    <div className={styles.posts}>
      <PageTitle pageTitle="Посты" marginBottom={20} marginTop={15} />
      {!filteredPosts.length ? (
        <NullResultsBlock text="Список постов пуст" />
      ) : (
        filteredPosts.map((post) => (
          <Post
            {...post}
            key={post?.postId}
            handleDelete={onDeletePost}
            handlePin={(postId) =>
              post?.postId === postId && handleChangePinnedPost(post)
            }
            pinned={post?.postId === pinnedPost?.postId}
            innerRef={ref}
          />
        ))
      )}
      {isLoading && (
        <div>
          <InfinitySpin width="200" color="#181F92" />
        </div>
      )}
    </div>
  );
};
