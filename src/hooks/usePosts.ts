import React, { Dispatch, SetStateAction, useState } from "react";

import { Api } from "@/api";
import { IPost } from "@/api/types";

type UsePostsProps = {
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  posts: IPost[];
};

export const usePosts = (
  newPosts: IPost[],
  page: number = 1,
  pinnedPost?: IPost,
  userId?: string | string[]
): UsePostsProps => {
  const [posts, setPosts] = useState<IPost[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        if (page === 1 && !userId) {
          const arr = await Api().post.getAll(1);

          setPosts(arr);
        } else if (page === 1 && userId) {
          const arr = await Api().post.getUserPosts(1, userId);

          await setPosts(arr);
        } else if (page > 1 && userId) {
          const arr = await Api().post.getUserPosts(page, userId);

          setPosts([...posts.concat(arr)]);
        } else {
          const arr = await Api().post.getAll(page);

          setPosts([...posts.concat(arr)]);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [page, pinnedPost, userId]);

  return { posts, setPosts };
};
