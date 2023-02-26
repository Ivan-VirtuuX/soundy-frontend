import React from "react";

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button } from "@material-ui/core";

import errorSticker from "@/images/errorSticker.png";
import stopSticker from "@/images/stopSticker.png";

const Error: NextPage = () => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>404 Not Found</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className="notFoundPageContainer">
        <div className="notFoundPageInner">
          <h2>Ошибка 404</h2>
          <p>Страница по данном адресу не существует</p>
          <Button variant="contained" onClick={() => router.push("/posts")}>
            На главную
          </Button>
          <div className="stickersBlock">
            <Image src={errorSticker} alt="errorSticker" quality={100} />
            <Image src={stopSticker} alt="stopSticker" quality={100} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Error;
