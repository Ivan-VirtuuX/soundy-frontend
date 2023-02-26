import { OutputData } from "@editorjs/editorjs";

export interface LoginDto {
  login: string;
  password: string;
}

export interface CreateUserDto extends LoginDto {
  name: string;
  surname: string;
  birthDate: Date;
}

export type CreateCommentDto = {
  postId?: string;
  author: string;
  text: string;
};

export interface IComment {
  postId: string;
  commentId: string;
  author: IUser;
  createdAt: Date;
  text: string;
  likes: ILike[];
}
export interface IPost {
  postId: string;
  author: ResponseUser;
  body: OutputData["blocks"];
  likes: ILike[];
  views: IUser[];
  createdAt: Date;
  comments: IComment[];
}

export interface ILike {
  likeId: string;
  postId?: string;
  author: IUser;
}

export interface IUser {
  userId: string;
  login: string;
  name: string;
  surname: string;
  avatarUrl: string;
}

export interface ResponseUser {
  id?: string;
  _id?: string;
  userId: string;
  avatarUrl: string;
  login: string;
  name: string;
  surname: string;
  birthDate: Date;
  token?: string;
  createdAt?: string;
}

export interface SearchPostDto {
  body?: string;
  views?: "DESC" | "ASC";
  limit?: number;
  take?: number;
  tag?: string;
}

export interface CreatePostDto {
  body: OutputData["blocks"];
}
