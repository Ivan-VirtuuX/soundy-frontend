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
  const [newPosts, setNewPosts] = React.useState<IPost[]>([]);
  const [page, setPage] = React.useState(1);

  const router = useRouter();

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const { posts, isPostsLoading, setIsPostsLoading } = usePosts(
    newPosts,
    page,
    pinnedPost,
    router?.query?.id
  );

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
    setFilteredPosts([]);
  }, [router.query.id]);

  React.useEffect(() => {
    (async () => {
      try {
        setIsPostsLoading(true);

        const data = await Api().post.getPinnedPost(userId);

        if (data) {
          setFilteredPosts([
            data,
            ...posts.filter((post) => post.postId !== data.postId),
          ]);

          setIsPostsLoading(false);
        } else if (filteredPosts.length === 0) {
          const data = await Api().post.getUserPosts(page, userId);

          setFilteredPosts([
            ...filteredPosts.concat(data).filter((post) => !post.pinned),
          ]);

          setIsPostsLoading(false);
        } else {
          setFilteredPosts(posts);

          setIsPostsLoading(false);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [posts, pinnedPost]);

  React.useEffect(() => {
    (async () => {
      setIsPostsLoading(true);

      if (posts.length >= 4) {
        try {
          if (inView) {
            const data = await Api().post.getUserPosts(page, userId);

            setNewPosts(data);

            setFilteredPosts([...posts.filter((post) => !post.pinned)]);

            setPage((page) => page + 1);

            setIsPostsLoading(false);
          }
        } catch (err) {
          console.warn(err);
        }
      }
    })();
  }, [inView, userId, posts.length]);

  return (
    <div>
      <PageTitle pageTitle="Посты" marginBottom={20} marginTop={15} />
      <ul className={styles.posts} ref={parent}>
        {filteredPosts.length === 0 && !isPostsLoading ? (
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
        {isPostsLoading && (
          <li className={styles.spinLoader}>
            <InfinitySpin width="200" color="#181F92" />
          </li>
        )}
      </ul>
    </div>
  );
};
