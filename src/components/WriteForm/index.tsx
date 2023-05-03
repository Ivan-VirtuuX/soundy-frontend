import React, { FC } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { Api } from "@/api";

import { BlueButton } from "@/components/ui/BlueButton";
import { UploadIcon } from "@/components/ui/Icons/UploadIcon";

import { OutputData } from "@editorjs/editorjs";

import styles from "./WriteForm.module.scss";

const Editor = dynamic(() => import("../Editor"), {
  ssr: false,
});

interface WriteFormProps {
  data?: any;
  fromUsersPage?: boolean;
}

export const WriteForm: FC<WriteFormProps> = ({ data, fromUsersPage }) => {
  const [blocks, setBlocks] = React.useState(data?.body || []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isImageSubmitting, setIsImageSubmitting] = React.useState(false);

  const router = useRouter();

  const userData = useAppSelector(selectUserData);

  const onAddPost = async () => {
    try {
      setIsLoading(true);

      const obj = {
        body: blocks,
        id: userData?.userId,
      };

      if (blocks.length && fromUsersPage) {
        await Api().post.create(obj);

        await router.push(`/users/${userData?.userId}`);
      } else {
        if (blocks.length) {
          await Api().post.create(obj);

          await router.push(`/posts`);
        }
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeEditorFields = (arr: OutputData["blocks"]) => {
    setBlocks(arr);
  };

  return (
    <div style={{ backgroundColor: "white" }} className={styles.writeContainer}>
      <div className={styles.head}>
        <h2>Создание статьи</h2>
        <BlueButton
          text="Опубликовать"
          handleClick={onAddPost}
          disabled={isImageSubmitting || !blocks.length || isLoading}
          color="primary"
        >
          <UploadIcon className={styles.uploadIcon} />
        </BlueButton>
      </div>
      <div className={styles.editor}>
        <Editor
          handleSubmittingImage={() => setIsImageSubmitting(true)}
          handleSubmittedImage={() => setIsImageSubmitting(false)}
          initialBlocks={data?.body}
          onChange={onChangeEditorFields}
        />
      </div>
    </div>
  );
};
