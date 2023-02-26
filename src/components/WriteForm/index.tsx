import React, { FC } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { Api } from "@/api/index";

import { BlueButton } from "@/components/UI/BlueButton";

import styles from "./WriteForm.module.scss";
import { Alert } from "@mui/material";
import { OutputData } from "@editorjs/editorjs";

const Editor = dynamic(() => import("../Editor"), {
  ssr: false,
});

interface WriteFormProps {
  data?: any;
}

export const WriteForm: FC<WriteFormProps> = ({ data }) => {
  const [blocks, setBlocks] = React.useState(data?.body || []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
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

      if (blocks.length) {
        const post = await Api().post.create(obj);

        await router.push(`/posts`);
      }
      setIsError(true);
    } catch (err) {
      console.warn(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeEditorFields = (arr: OutputData["blocks"]) => {
    setBlocks(arr);
    setIsError(false);
  };

  return (
    <div style={{ backgroundColor: "white" }} className={styles.writeContainer}>
      <div className={styles.head}>
        <h2>Создание статьи</h2>
        <BlueButton
          text="Опубликовать"
          handleClick={onAddPost}
          disabled={isImageSubmitting}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_26_476)">
              <path
                d="M7.5 15C7.23438 15 7.01156 14.91 6.83156 14.73C6.65156 14.55 6.56188 14.3275 6.5625 14.0625V7.35938L4.80469 9.11719C4.63281 9.28906 4.41 9.37125 4.13625 9.36375C3.8625 9.35625 3.64 9.26625 3.46875 9.09375C3.29688 8.92188 3.21094 8.70313 3.21094 8.4375C3.21094 8.17188 3.29688 7.95313 3.46875 7.78125L6.84375 4.40625C6.9375 4.3125 7.03906 4.24625 7.14844 4.2075C7.25781 4.16875 7.375 4.14906 7.5 4.14844C7.625 4.14844 7.74219 4.16813 7.85156 4.2075C7.96094 4.24688 8.0625 4.31313 8.15625 4.40625L11.5313 7.78125C11.7031 7.95313 11.7891 8.17188 11.7891 8.4375C11.7891 8.70313 11.7031 8.92188 11.5313 9.09375C11.3594 9.26562 11.1366 9.35563 10.8628 9.36375C10.5891 9.37188 10.3666 9.28969 10.1953 9.11719L8.4375 7.35938V14.0625C8.4375 14.3281 8.3475 14.5509 8.1675 14.7309C7.9875 14.9109 7.765 15.0006 7.5 15ZM0.937503 4.6875C0.671878 4.6875 0.449066 4.5975 0.269066 4.4175C0.0890659 4.2375 -0.000621756 4.015 3.24394e-06 3.75V1.875C3.24394e-06 1.35938 0.183753 0.917814 0.551253 0.550314C0.918753 0.182814 1.36 -0.000623408 1.875 1.59168e-06H13.125C13.6406 1.59168e-06 14.0822 0.183751 14.4497 0.551251C14.8172 0.918751 15.0006 1.36 15 1.875V3.75C15 4.01563 14.91 4.23844 14.73 4.41844C14.55 4.59844 14.3275 4.68813 14.0625 4.6875C13.7969 4.6875 13.5741 4.5975 13.3941 4.4175C13.2141 4.2375 13.1244 4.015 13.125 3.75V1.875H1.875V3.75C1.875 4.01563 1.785 4.23844 1.605 4.41844C1.425 4.59844 1.2025 4.68813 0.937503 4.6875Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_26_476">
                <rect width="15" height="15" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </BlueButton>
        {isError && (
          <Alert
            severity="error"
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
              marginTop: 20,
              borderRadius: 17,
              height: 50,
              width: "100%",
            }}
          >
            Текст поста пуст
          </Alert>
        )}
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
