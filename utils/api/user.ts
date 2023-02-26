import { AxiosInstance } from "axios";
import { CreateUserDto, LoginDto, ResponseUser } from "./types";

export const UserApi = (instance: AxiosInstance) => ({
  async updateAvatar(userId: string | string[], avatarUrl: string) {
    const { data } = await instance.patch(`/users/${userId}`, { avatarUrl });

    return data;
  },

  async getAll() {
    const { data } = await instance.get<ResponseUser[]>("/users");

    return data;
  },

  async buyDonate({ name, serverName }: { name: string; serverName: string }) {
    const { data } = await instance.post<ResponseUser>("/users/donate", {
      name,
      serverName,
    });

    return data;
  },

  async getOne(userId: string | string[]) {
    const { data } = await instance.get<ResponseUser>(`/users/${userId}`);

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

  async changePassword(newPassword: string) {
    const { data } = await instance.patch<ResponseUser>("/users", {
      newPassword: newPassword,
    });

    return data;
  },
});
