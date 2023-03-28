import { AxiosInstance } from "axios";
import { ConversationDto, IConversation } from "./types";

export const ConversationApi = (instance: AxiosInstance) => ({
  async createConversation(dto: ConversationDto) {
    const { data } = await instance.post("/conversations", dto);

    return data;
  },

  async getAll() {
    const { data } = await instance.get<IConversation[]>("/conversations");

    return data;
  },

  async getOne(conversationId: string) {
    const { data } = await instance.get<IConversation>(
      `/conversations/${conversationId}`
    );

    return data;
  },

  async getMessages(conversationId: string) {
    const { data } = await instance.get<IConversation>(
      `/conversations/${conversationId}/messages`
    );

    return data;
  },

  async deleteConversation(conversationId: string) {
    const { data } = await instance.delete<IConversation>(
      `/conversations/${conversationId}`
    );

    return data;
  },
});
