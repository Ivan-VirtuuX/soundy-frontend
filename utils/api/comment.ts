import { AxiosInstance } from "axios";
import { CreateCommentDto, IComment } from "./types";

export const CommentApi = (instance: AxiosInstance) => ({
  async getAll(postId?: string | string[]) {
    if (postId) {
      const { data } = await instance.get<IComment[]>(
        `/posts/${postId}/comments`
      );

      return data;
    } else {
      const { data } = await instance.get<IComment[]>(`/posts/comments`);

      return data;
    }
  },

  async getOne(postId: string) {
    const { data } = await instance.get<IComment[]>(
      `/posts/${postId}/comments`
    );

    return data;
  },

  async addComment(dto: CreateCommentDto) {
    const { data } = await instance.post(`/comments`, dto);

    return data;
  },

  async addCommentLike(commentId: string, postId: string) {
    const { data } = await instance.post(`/comments/${commentId}`, {
      postId,
    });

    return data;
  },

  async removeCommentLike(commentId: string, likeId: string) {
    const { data } = await instance.delete(`/comments/${commentId}`, {
      data: { likeId: likeId },
    });

    return data;
  },

  async remove(commentId: string, postId: string) {
    const { data } = await instance.delete(`/posts/${postId}/comments`, {
      data: { commentId: commentId },
    });

    return data;
  },
});
