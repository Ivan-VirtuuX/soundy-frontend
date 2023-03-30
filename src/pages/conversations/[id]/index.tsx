import React, { useContext } from "react";

import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

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

import { Api } from "@/api/index";
import { IConversation, IMessage } from "@/api/types";
import { CloudinaryApi } from "@/api/CloudinaryApi";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import styles from "./Conversation.module.scss";

interface ConversationProps extends IConversation {
  messages: IMessage[];
}

const Conversation: NextPage<ConversationProps> = ({
  messages,
  sender,
  receiver,
  conversationId,
}) => {
  const [attachedImageFormData, setAttachedImageFormData] =
    React.useState<FormData>();
  const [localMessages, setLocalMessages] =
    React.useState<IMessage[]>(messages);
  const [attachedImage, setAttachedImage] = React.useState<File>();
  const [isUploading, setIsUploading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [preview, setPreview] = React.useState("");

  const messageContainerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  const userData = useAppSelector(selectUserData);

  const socket = useContext(SocketContext);

  const router = useRouter();

  const { id } = router.query;

  const [parent] = useAutoAnimate();

  const conversationUser =
    receiver?.userId === userData?.id ? sender : receiver;

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

  const onSubmitAttachedImage = async () => {
    try {
      setIsUploading(true);

      const { data } = await CloudinaryApi().cloudinary.changeImage(
        attachedImageFormData
      );

      setIsUploading(false);

      return data;
    } catch (err) {
      console.warn(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAttachedImage = (image: File, imageFormData: FormData) => {
    setAttachedImage(image);
    setAttachedImageFormData(imageFormData);
  };

  const handleSubmitNewMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      if (attachedImageFormData && message) {
        const { secure_url } = await onSubmitAttachedImage();

        if (secure_url) {
          await Api().message.sendMessage({
            messageId: uuidv4(),
            conversationId: String(id),
            sender: { ...userData },
            content: { text: message, imageUrl: secure_url },
            createdAt: new Date(),
          });

          setAttachedImageFormData(null);
          setPreview("");
          setMessage("");
        }
      } else {
        if (attachedImageFormData) {
          const { secure_url } = await onSubmitAttachedImage();

          if (secure_url) {
            await Api().message.sendMessage({
              messageId: uuidv4(),
              conversationId: String(id),
              sender: { ...userData },
              content: { imageUrl: secure_url },
              createdAt: new Date(),
            });

            setAttachedImageFormData(null);
            setPreview("");
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
        socket.on("onMessage", async (payload) => {
          const { ...message } = payload;

          if (conversationId === message.conversationId) {
            const data = await Api().conversation.getOne(
              message.conversationId
            );

            if (
              data.receiver?.userId === userData.id ||
              data.sender?.userId === userData.id
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
              <img
                className={styles.avatar}
                src={conversationUser.avatarUrl}
                alt="avatar"
                onClick={() =>
                  router.push(`/users/${conversationUser?.userId}`)
                }
              />
            ) : (
              <EmptyAvatar
                width={40}
                handleClick={() =>
                  router.push(`/users/${conversationUser?.userId}`)
                }
              />
            )}
            <div
              className={styles.userInfo}
              onClick={() => router.push(`/users/${conversationUser?.userId}`)}
            >
              <div className={styles.nameSurname}>
                <span>{conversationUser?.name}</span>
                <span>{conversationUser?.surname}</span>
              </div>
              <span className={styles.nickname}>{conversationUser?.login}</span>
            </div>
          </div>
          <IconButton
            className={styles.closeButton}
            onClick={() => router.push("/conversations")}
          >
            <CrossIcon size={16} color="#A9A9A9" />
          </IconButton>
        </div>
        <ul className={styles.content} ref={parent}>
          {localMessages
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
                  ]?.sender?.userId
                }
              />
            ))
            .reverse()}
        </ul>
        <div className={styles.bottom}>
          <InputField
            text={message}
            handleChangeText={(text) => setMessage(text)}
            handleChangeAttachedImage={handleChangeAttachedImage}
            handleChangeAttachedImageFormData={(data) =>
              setAttachedImageFormData(data)
            }
            handleChangeAttachImage={(image) => setAttachedImage(image)}
            handleChangePreview={(preview) => setPreview(preview)}
            handleSubmit={handleSubmitNewMessage}
            isUploading={isUploading}
            attachedImage={attachedImage}
            preview={preview}
          />
        </div>
      </main>
    </MainLayout>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!ctx.req.cookies.authToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const data = await Api().conversation.getMessages(ctx.query.id);

  const conversation = await Api(ctx).conversation.getOne(ctx.query.id);

  return {
    props: { messages: data, ...conversation },
  };
};
