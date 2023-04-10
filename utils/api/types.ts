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
  content: { text?: string; images?: ICloudinaryImage[] };
};

export interface IComment {
  postId: string;
  commentId: string;
  author: IUser;
  createdAt: Date;
  content: { text?: string; images?: ICloudinaryImage[] };
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
  playlist?: ITrack[];
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
  playlist?: ITrack[];
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

export interface SearchUserDto {
  _name?: string;
  _surname?: string;
  _login?: string;
  _query?: string;
}

export interface CreatePostDto {
  body: OutputData["blocks"];
}

export interface ITrack {
  id: number;
  name: string;
  artist: string;
  trackSrc: string;
  coverUrl: string;
}

interface ICloudinaryImage {
  asset_id: string;
  width: number;
  height: number;
  url: string;
}

export interface IConversation {
  conversationId: string;
  sender: IUser;
  receiver: IUser;
  messages: IMessage[];
  updatedAt: Date;
}

export type IMessage = {
  messageId?: string;
  id?: string;
  conversationId: string;
  sender?: IUser;
  content: { text?: string; images?: ICloudinaryImage[] };
  createdAt?: Date;
};

export type ConversationDto = {
  receiver: string | string[];
};
