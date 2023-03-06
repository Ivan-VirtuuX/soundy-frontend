import { AxiosInstance } from "axios";
import {
  ChangeUserDataDto,
  CreateUserDto,
  IUser,
  LoginDto,
  ResponseUser,
} from "./types";

export const UserApi = (instance: AxiosInstance) => ({
  async updateAvatar(userId: string | string[], avatarUrl: string) {
    const { data } = await instance.patch(`/users/${userId}/avatar`, {
      avatarUrl,
    });

    return data;
  },

  async getOne(userId: string | string[]) {
    const { data } = await instance.get<ResponseUser>(`/users/${userId}`);

    return data;
  },

  async getFriends(userId: string | string[]) {
    const { data } = await instance.get<IUser[]>(`/users/${userId}/friends`);

    return data;
  },

  async register(dto: CreateUserDto) {
    const { data } = await instance.post<CreateUserDto, { data: ResponseUser }>(
      "/auth/register",
      dto
    );

    return data;
  },

  async login(dto: LoginDto) {
    const { data } = await instance.post<LoginDto, { data: ResponseUser }>(
      "/auth/login",
      dto
    );

    return data;
  },

  async getMe() {
    const { data } = await instance.get<ResponseUser>("/auth/me");

    return data;
  },

  async getFriendRequests(userId: string | string[]) {
    const { data } = await instance.get<ResponseUser>(
      `/users/${userId}/friend-requests`
    );

    return data;
  },

  async addFriendRequests(userId: string | string[]) {
    const { data } = await instance.post<ResponseUser>(
      `/users/${userId}/friend-requests`
    );

    return data;
  },

  async confirmFriendRequest(userId: string, requestFriendId: string) {
    const { data } = await instance.patch<ResponseUser>(
      `/users/${userId}/friend-requests`,
      {
        requestFriendId,
      }
    );

    return data;
  },

  async cancelFriendRequest(
    userId: string,
    requestFriendId: string | string[]
  ) {
    const { data } = await instance.delete<ResponseUser>(
      `/users/${requestFriendId}/friend-requests`,
      {
        data: { userId },
      }
    );

    return data;
  },

  async changeUserData(dto: ChangeUserDataDto, userId: string) {
    const { data } = await instance.patch<ResponseUser>(`/users/${userId}`, {
      data: dto,
    });

    return data;
  },

  async deleteFriend(userId: string, friendId: string | string[]) {
    const { data } = await instance.delete<ResponseUser>(
      `/users/${userId}/friends`,
      {
        data: { friendId },
      }
    );

    return data;
  },
});
