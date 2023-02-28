import React, { Dispatch, SetStateAction, useState } from "react";
import { Api } from "@/api/index";
import { IPost } from "@/api/types";

type UsePostsProps = {
  setPosts: Dispatch<SetStateAction<IPost[]>>;
  posts: IPost[];
};

export const usePosts = (
  newPosts: IPost[],
  page: number = 1,
  pinnedPost?: string,
  postId?: string
): UsePostsProps => {
  const [posts, setPosts] = useState<IPost[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        if (page === 1) {
          const arr = await Api().post.getAll(1);

          setPosts(arr);
        } else {
          const arr = await Api().post.getAll(page);

          setPosts([...posts.concat(arr)]);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [page, pinnedPost]);

  return { posts, setPosts };
};
