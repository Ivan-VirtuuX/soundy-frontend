import React from "react";

import type { AppProps } from "next/app";
import { Router, useRouter } from "next/router";

import { wrapper } from "@/redux/store";
import { setUserData } from "@/redux/slices/user";

import { Api } from "@/api";

import { Header } from "@/components/Header";

import { MuiThemeProvider } from "@material-ui/core";

import { theme } from "@/theme";

import "nprogress/nprogress.css";
import "@/styles/nprogress.scss";
import NProgress from "nprogress";

import { socket, SocketContext } from "@/utils/SocketContext";

import "@/styles/globals.scss";
import { useMediaQuery } from "@mui/material";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });
  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
  Router.events.on("routeChangeError", () => NProgress.done());

  const match992 = useMediaQuery("(max-width: 992px)");

  const router = useRouter();

  return (
    <>
      {router.asPath !== "/" &&
        !(
          match992 &&
          router.asPath.includes("conversations") &&
          router.query.id
        ) && <Header />}
      <SocketContext.Provider value={socket}>
        <MuiThemeProvider theme={theme}>
          <Component {...pageProps} />
        </MuiThemeProvider>
      </SocketContext.Provider>
    </>
  );
};

App.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ ctx, Component }) => {
      try {
        const userData = await Api(ctx).user.getMe();

        store.dispatch(setUserData(userData));
      } catch (err) {
        console.warn("Авторизуйтесь");
      }

      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps({ ...ctx, store })
          : {},
      };
    }
);

export default wrapper.withRedux(App);
