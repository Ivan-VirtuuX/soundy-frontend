import React, { useContext } from "react";

import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { v4 as uuidv4 } from "uuid";

import { MainLayout } from "@/layouts/MainLayout";

import { MessageItem } from "@/components/MessageItem";
import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";
import { InputField } from "@/components/InputField";

import { IconButton } from "@mui/material";

import { SocketContext } from "@/utils/SocketContext";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { Api } from "@/api";
import { IConversation, IMessage } from "@/api/types";
import { CloudinaryApi } from "@/api/CloudinaryApi";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import crySticker from "@/public/images/crySticker.png";

import styles from "./Conversation.module.scss";

const Conversation: NextPage<IConversation> = ({
  messages,
  sender,
  receiver,
  conversationId,
}) => {
  const [attachedImagesFormData, setAttachedImagesFormData] = React.useState<
    FormData[]
  >([]);
  const [attachedImages, setAttachedImages] = React.useState<File[]>([]);
  const [localMessages, setLocalMessages] =
    React.useState<IMessage[]>(messages);
  const [isUploading, setIsUploading] = React.useState(false);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState("");

  const messageContainerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  const userData = useAppSelector(selectUserData);

  const socket = useContext(SocketContext);

  const router = useRouter();

  const { id } = router.query;

  const [parent] = useAutoAnimate();

  const conversationUser =
    receiver?.userId === userData?.userId ? sender : receiver;

  const moveUp = [
    {
      transform: "translateY(30px)",
      transition: "all 0.05s ease-in-out",
    },
    {
      transform: "translateY(0px)",
      transition: "all 0.05s ease-in-out",
    },
  ];

  const timing = {
    duration: 60,
    iterations: 1,
  };

  const onSubmitAttachedImages = async () => {
    try {
      setIsUploading(true);

      const promises = [];

      for (let i: number = 0; i < attachedImagesFormData.length; i++) {
        const { data } = await CloudinaryApi().cloudinary.changeImage(
          attachedImagesFormData[i]
        );

        promises.push(data);
      }

      await Promise.all(promises);

      setIsUploading(false);

      return promises;
    } catch (err) {
      console.warn(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAttachedImages = (
    images: File[],
    imagesFormData: FormData[]
  ) => {
    setAttachedImages([...attachedImages.concat(images)]);
    setAttachedImagesFormData([
      ...attachedImagesFormData.concat(imagesFormData),
    ]);
  };

  const onRemoveAttachedImage = (preview) => {
    setAttachedImages([]);
    setAttachedImagesFormData([]);
    setPreviews([...previews.filter((img) => img !== preview)]);
  };

  const handleSubmitNewMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      if (attachedImagesFormData.length !== 0 && message) {
        const data = await onSubmitAttachedImages();

        if (data.length !== 0) {
          await Api().message.sendMessage({
            messageId: uuidv4(),
            conversationId: String(id),
            sender: { ...userData },
            content: { text: message, images: data },
            createdAt: new Date(),
          });

          setAttachedImagesFormData([]);
          setPreviews([]);
          setMessage("");
        }
      } else {
        if (attachedImagesFormData.length !== 0) {
          const data = await onSubmitAttachedImages();

          if (data.length !== 0) {
            await Api().message.sendMessage({
              messageId: uuidv4(),
              conversationId: String(id),
              sender: { ...userData },
              content: { images: data },
              createdAt: new Date(),
            });

            setAttachedImagesFormData([]);
            setPreviews([]);
          }
        }
        if (message) {
          setIsUploading(true);

          await Api().message.sendMessage({
            messageId: uuidv4(),
            conversationId: String(id),
            sender: { ...userData },
            content: { text: message },
            createdAt: new Date(),
          });

          setMessage("");
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        socket.on("onMessage", async ({ ...message }) => {
          if (conversationId === message.conversationId) {
            const data = await Api().conversation.getOne(
              message.conversationId
            );

            if (
              data.receiver?.userId === userData?.userId ||
              data.sender?.userId === userData?.userId
            ) {
              setLocalMessages((localMessages) => [...localMessages, message]);
            }
          }
        });
        socket.on("onDeleteMessage", (messageId) => {
          setLocalMessages((localMessages) => [
            ...localMessages.filter(
              (message) => message.messageId !== messageId
            ),
          ]);
        });
      } catch (err) {
        console.warn(err);
      }
    })();

    return () => {
      socket.off("onMessage");
      socket.off("onDeleteMessage");
      socket.off("message");
    };
  }, [socket]);

  React.useEffect(() => {
    contentRef?.current?.animate(moveUp, timing);
  }, [localMessages]);

  return (
    <MainLayout fullWidth>
      <Head>
        <title>Сообщения</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicons/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <div className={styles.head}>
          <div className={styles.leftSide}>
            {conversationUser?.avatarUrl ? (
              <Link href={`/users/${conversationUser?.userId}`}>
                <img
                  className={styles.avatar}
                  src={conversationUser.avatarUrl}
                  alt="avatar"
                />
              </Link>
            ) : (
              <Link href={`/users/${conversationUser?.userId}`}>
                <EmptyAvatar width={40} />
              </Link>
            )}
            <Link href={`/users/${conversationUser?.userId}`}>
              <div className={styles.userInfo}>
                <div className={styles.nameSurname}>
                  <span>{conversationUser?.name}</span>
                  <span>{conversationUser?.surname}</span>
                </div>
                <span className={styles.nickname}>
                  {conversationUser?.login}
                </span>
              </div>
            </Link>
          </div>
          <IconButton
            className={styles.closeButton}
            onClick={() => router.push("/conversations")}
          >
            <CrossIcon size={16} color="#A9A9A9" />
          </IconButton>
        </div>
        <ul
          className={styles.content}
          ref={parent}
          style={{ justifyContent: localMessages.length === 0 && "center" }}
        >
          {localMessages.length === 0 ? (
            <div className={styles.emptyConversationBlock}>
              <p className={styles.emptyConversationTitle}>
                Список сообщений пуст
              </p>
              <p className={styles.emptyConversationText}>
                Станьте первым, кто напишет сообщение
              </p>
              <Image
                src={crySticker}
                alt="crySticker"
                quality={100}
                className={styles.emptyConversationImg}
              />
            </div>
          ) : (
            localMessages
              .map((message) => (
                <MessageItem
                  key={message.messageId}
                  {...message}
                  innerRef={messageContainerRef}
                  nextMessageSenderId={
                    localMessages[
                      localMessages?.findIndex(
                        (msg) => msg.messageId === message.messageId
                      ) + 1
                    ]?.sender.userId
                  }
                  lastSenderMessage={
                    localMessages
                      .filter(
                        (msg) => msg.sender.userId === message.sender.userId
                      )
                      .slice(-1)[0]
                  }
                  lastReceiverMessage={
                    localMessages
                      .filter(
                        (msg) => msg.sender.userId !== message.sender.userId
                      )
                      .slice(-1)[0]
                  }
                />
              ))
              .reverse()
          )}
        </ul>
        <div className={styles.bottom}>
          <InputField
            text={message}
            handleChangeText={(text) => setMessage(text)}
            handleChangeAttachedImages={handleChangeAttachedImages}
            handleChangePreview={(preview) =>
              setPreviews([...previews, preview])
            }
            handleRemoveAttachedImage={onRemoveAttachedImage}
            handleSubmit={handleSubmitNewMessage}
            isUploading={isUploading}
            attachedImages={attachedImages}
            previews={previews}
          />
        </div>
      </main>
    </MainLayout>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const conversation = await Api(ctx).conversation.getOne(ctx.query.id);

  const user = await Api(ctx).user.getMe();

  if (
    ctx.req.cookies.authToken &&
    (conversation?.sender?.userId === user.userId ||
      conversation?.receiver?.userId === user.userId) &&
    conversation
  ) {
    return {
      props: { ...conversation },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
