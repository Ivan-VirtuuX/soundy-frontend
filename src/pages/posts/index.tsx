import React from "react";
import { useInView } from "react-intersection-observer";
import { InfinitySpin } from "react-loader-spinner";

import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { MainLayout } from "@/layouts/MainLayout";

import { Post } from "@/components/Post";
import { PageTitle } from "@/components/ui/PageTitle";
import { BlueButton } from "@/components/ui/BlueButton";
import { PencilIcon } from "@/components/ui/Icons/PencilIcon";
import { NotificationsBlock } from "@/components/NotificationsBlock";

import { usePosts } from "@/hooks/usePosts";

import { IPost } from "@/api/types";
import { Api } from "@/api";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import styles from "./Posts.module.scss";

const Posts: NextPage = () => {
  const [isPostsLoading, setIPostsLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newPosts, setNewPosts] = React.useState<IPost[]>([]);
  const [page, setPage] = React.useState(1);

  const router = useRouter();

  const { posts, setPosts } = usePosts(newPosts, page);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const [parent] = useAutoAnimate();

  React.useEffect(() => {
    (async () => {
      if (posts.length >= 5) {
        try {
          if (inView) {
            setIsLoading(true);

            const data = await Api().post.getAll(page);

            setNewPosts(data);

            setPage((page) => page + 1);

            setIsLoading(false);
          }
        } catch (err) {
          console.warn(err);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [inView]);

  return (
    <MainLayout fullWidth>
      <Head>
        <title>Посты</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <PageTitle pageTitle="Посты" />
        <div style={{ marginBottom: 20 }} onClick={() => router.push("/write")}>
          <BlueButton color="primary" text="Создать">
            <PencilIcon width={17} height={17} />
          </BlueButton>
        </div>
        <ul ref={parent} className={styles.postsBlock}>
          {posts.map((post) => (
            <li key={post.postId}>
              <Post
                handleDelete={(postId: string) =>
                  setPosts((posts) => [
                    ...posts.filter((post) => post.postId !== postId),
                  ])
                }
                innerRef={ref}
                {...post}
              />
            </li>
          ))}
        </ul>
        {isLoading && (
          <div className={styles.loadSpinner}>
            <InfinitySpin width="200" color="#181F92" />
          </div>
        )}
        <NotificationsBlock />
      </main>
    </MainLayout>
  );
};

export default Posts;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ctx.req.cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
