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
  pinned?: boolean;
}

export interface ILike {
  likeId: string;
  postId?: string;
  author: IUser;
}

export interface IUser {
  id?: string;
  userId: string;
  login: string;
  name: string;
  surname: string;
  avatarUrl: string;
  friends?: IUser[];
  friendRequests?: IUser[];
  birthDate?: Date;
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
  friends: IUser[];
  friendRequests: IUser[];
  token?: string;
  createdAt?: string;
  response?: {
    error: string;
    message: string;
    statusCode: number;
  };
}

export interface ChangeUserDataDto {
  name: string;
  surname: string;
  birthDate: Date;
}

export interface CreatePostDto {
  body: OutputData["blocks"];
}

export interface SearchUserDto {
  _name?: string;
  _surname?: string;
  _login?: string;
  _query?: string;
}

export interface ITrack {
  id: number;
  name: string;
  artist: string;
  trackSrc: string;
  coverUrl: string;
}
