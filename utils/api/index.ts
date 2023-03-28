import { GetServerSidePropsContext, NextPageContext } from "next";

import axios from "axios";

import Cookies, { parseCookies } from "nookies";

import { UserApi } from "./user";
import { PostApi } from "./post";
import { CommentApi } from "./comment";
import { MessageApi } from "@/api/message";
import { ConversationApi } from "@/api/conversation";

export type ApiReturnType = {
  user: ReturnType<typeof UserApi>;
  post: ReturnType<typeof PostApi>;
  comment: ReturnType<typeof CommentApi>;
  message: ReturnType<typeof MessageApi>;
  conversation: ReturnType<typeof ConversationApi>;
};

export const Api = (
  ctx?: NextPageContext | GetServerSidePropsContext
): ApiReturnType => {
  const cookies = ctx ? Cookies.get(ctx) : parseCookies();
  const token = cookies.authToken;

  const instance = axios.create({
    baseURL: "http://localhost:7777",
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  const apis = {
    user: UserApi,
    post: PostApi,
    comment: CommentApi,
    message: MessageApi,
    conversation: ConversationApi,
  };

  return Object.entries(apis).reduce((prev, [key, f]) => {
    return {
      ...prev,
      [key]: f(instance),
    };
  }, {} as ApiReturnType);
};
