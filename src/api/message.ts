import { AxiosInstance } from "axios";

import { IMessage } from "./types";

export const MessageApi = (instance: AxiosInstance) => ({
  async sendMessage(message: IMessage) {
    const { data } = await instance.post("/messages", message);

    return data;
  },

  async deleteMessage(messageId: string) {
    const { data } = await instance.delete<IMessage>(`/messages/${messageId}`);

    return data;
  },
});
