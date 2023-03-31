import { AxiosInstance } from "axios";

import { CreatePostDto, IPost } from "./types";

export const PostApi = (instance: AxiosInstance) => ({
  async getAll(_page: number) {
    const { data } = await instance.get<IPost[]>("/posts", {
      params: {
        _limit: 5,
        _page,
      },
    });

    return data;
  },

  async getUserPosts(_page: number, userId: string | string[]) {
    const { data } = await instance.get<IPost[]>("/posts/user", {
      params: {
        _limit: 4,
        _page,
        userId,
      },
    });

    return data;
  },

  async getPinnedPost(userId: string | string[]) {
    const { data } = await instance.get<IPost>("/posts/pinned", {
      params: {
        userId,
      },
    });

    return data;
  },

  async searchPosts(_text: string, _page: number) {
    const { data } = await instance.get<IPost[]>("/posts/search", {
      params: {
        _text,
        _limit: 5,
        _page,
      },
    });

    return data;
  },

  async addLike(postId: string) {
    const { data } = await instance.post(`/posts/${postId}/likes`);

    return data;
  },

  async removeLike(postId: string, likeId: string) {
    const { data } = await instance.delete(`/posts/${postId}/likes`, {
      data: { likeId: likeId },
    });

    return data;
  },

  async create(dto: CreatePostDto) {
    const { data } = await instance.post<CreatePostDto, { data: IPost }>(
      "/posts",
      dto
    );

    return data;
  },

  async addView(postId: string) {
    const { data } = await instance.post<IPost>(`/posts/${postId}`);

    return data;
  },

  async addPin(postId: string) {
    const { data } = await instance.post<IPost>(`/posts/${postId}/pins`);

    return data;
  },

  async delete(postId: string) {
    const { data } = await instance.delete<IPost>(`/posts`, {
      data: { postId: postId },
    });

    return data;
  },
});
