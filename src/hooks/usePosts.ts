import React, { Dispatch, SetStateAction, useState } from "react";

import { Api } from "@/api";
import { IPost } from "@/api/types";

interface UsePostsProps {
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  posts: IPost[];
  isPostsLoading?: boolean;
  setIsPostsLoading?: (isPostsLoading: boolean) => void;
}

export const usePosts = (
  newPosts: IPost[],
  page: number = 1,
  pinnedPost?: IPost,
  userId?: string | string[]
): UsePostsProps => {
  const [isPostsLoading, setIsPostsLoading] = React.useState(false);
  const [posts, setPosts] = useState<IPost[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        if (page === 1 && !userId) {
          setIsPostsLoading(true);

          const arr = await Api().post.getAll(1);

          setPosts(arr);

          setIsPostsLoading(false);
        } else if (page === 1 && userId) {
          setIsPostsLoading(true);

          const arr = await Api().post.getUserPosts(1, userId);

          await setPosts(arr);

          setIsPostsLoading(false);
        } else if (page > 1 && userId) {
          setIsPostsLoading(true);

          const arr = await Api().post.getUserPosts(page, userId);

          setPosts([...posts.concat(arr)]);
        } else {
          setIsPostsLoading(true);

          const arr = await Api().post.getAll(page);

          setPosts([...posts.concat(arr)]);

          setIsPostsLoading(false);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [page, pinnedPost, userId]);

  return { posts, setPosts, isPostsLoading, setIsPostsLoading };
};
