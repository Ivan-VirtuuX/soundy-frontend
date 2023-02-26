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

  async search(title: string) {
    const { data } = await instance.post<IPost[]>("/posts/search", {
      title: title,
    });

    return data;
  },

  async getAllPostsComments() {
    const { data } = await instance.get("/posts/comments");

    return data;
  },

  async getOne(postId: string | string[]) {
    const { data } = await instance.get<IPost>(`/posts/${postId}`);

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

  async delete(postId: string) {
    const { data } = await instance.delete<IPost>(`/posts`, {
      data: { postId: postId },
    });

    return data;
  },
});
