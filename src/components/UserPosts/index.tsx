import React from "react";
import { InfinitySpin } from "react-loader-spinner";
import { useInView } from "react-intersection-observer";

import { useRouter } from "next/router";

import { PageTitle } from "@/components/ui/PageTitle";
import { NullResultsBlock } from "@/components/ui/NullResultsBlock";
import { Post } from "@/components/Post";

import { IPost } from "@/api/types";
import { Api } from "@/api";

import { usePosts } from "@/hooks/usePosts";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import styles from "./UserPosts.module.scss";

interface UserPostsProps {
  pinnedPost: IPost;
  handleChangePinnedPost: (post?: IPost) => void;
  userId?: string | string[];
}

export const UserPosts: React.FC<UserPostsProps> = ({
  pinnedPost,
  handleChangePinnedPost,
  userId,
}) => {
  const [filteredPosts, setFilteredPosts] = React.useState<IPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newPosts, setNewPosts] = React.useState<IPost[]>([]);
  const [page, setPage] = React.useState(1);

  const router = useRouter();

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const { posts } = usePosts(newPosts, page, pinnedPost, router?.query?.id);

  const [parent] = useAutoAnimate();

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
        const data = await Api().post.getPinnedPost(userId);

        if (data) {
          setFilteredPosts([
            data,
            ...posts.filter((post) => post.postId !== data.postId),
          ]);
        } else if (filteredPosts.length === 0) {
          const data = await Api().post.getUserPosts(page, userId);

          setFilteredPosts([
            ...filteredPosts.concat(data).filter((post) => !post.pinned),
          ]);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [posts, router?.query?.id, pinnedPost]);

  React.useEffect(() => {
    (async () => {
      if (posts.length >= 4) {
        try {
          if (inView && posts.length !== 0) {
            setIsLoading(true);

            const data = await Api().post.getUserPosts(page, userId);

            setNewPosts(data);

            setFilteredPosts([...posts.filter((post) => !post.pinned)]);

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
  }, [inView, userId, posts.length]);

  return (
    <div>
      <PageTitle pageTitle="Посты" marginBottom={20} marginTop={15} />
      <ul className={styles.posts} ref={parent}>
        {filteredPosts.length === 0 ? (
          <li>
            <NullResultsBlock text="Список постов пуст" />
          </li>
        ) : (
          filteredPosts.map((post) => (
            <li key={post.postId}>
              <Post
                {...post}
                handleDelete={onDeletePost}
                handlePin={(postId) =>
                  post?.postId === postId && handleChangePinnedPost(post)
                }
                handleUnpin={(postId) =>
                  post?.postId === postId && handleChangePinnedPost()
                }
                pinned={post?.postId === pinnedPost?.postId}
                innerRef={ref}
              />
            </li>
          ))
        )}
      </ul>
      {isLoading && (
        <div>
          <InfinitySpin width="200" color="#181F92" />
        </div>
      )}
    </div>
  );
};
