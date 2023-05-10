import React, { FormEvent } from "react";
import { Oval } from "react-loader-spinner";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { AttachImagePopup } from "@/components/AttachImagePopup";
import { SmileIcon } from "@/components/ui/Icons/SmileIcon";
import { InputPreviewItem } from "@/components/InputPreviewItem";

import { IconButton, Tooltip } from "@mui/material";

import { EmojiStyle } from "emoji-picker-react";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import { SendIcon } from "../ui/Icons/SendIcon";

import styles from "./InputField.module.scss";

interface InputFieldProps {
  innerRef?: React.Ref<HTMLInputElement>;
  text: string;
  isUploading?: boolean;
  handleChangePreview: (preview: string) => void;
  attachedImages: File[];
  previews: string[];
  handleChangeText: (text: string) => void;
  handleChangeAttachedImages: (
    images: File[],
    imagesFormData: FormData[]
  ) => void;
  handleRemoveAttachedImage?: (preview: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  attachedImagesFormData: FormData[];
}

export const InputField: React.FC<InputFieldProps> = ({
  innerRef,
  text,
  isUploading,
  handleChangePreview,
  attachedImages,
  previews,
  handleChangeText,
  handleChangeAttachedImages,
  handleRemoveAttachedImage,
  handleSubmit,
  attachedImagesFormData,
}) => {
  const pickerRef = React.useRef(null);

  const Picker = dynamic(
    () => {
      return import("emoji-picker-react");
    },
    { ssr: false }
  );

  const router = useRouter();

  const [parent] = useAutoAnimate();

  useClickOutside(pickerRef, () => onMouseLeave());

  const { isVisible, onMouseOver, onMouseLeave } =
    useTransitionOpacity(pickerRef);

  React.useEffect(() => {
    (async () => {
      if (attachedImages?.length !== 0) {
        for (let i: number = 0; i < attachedImages?.length; i++) {
          const reader = new FileReader();

          reader.onloadend = async () => {
            await handleChangePreview(reader.result as string);
          };

          await reader?.readAsDataURL(attachedImages[i]);
        }
      }
    })();
  }, [attachedImages]);

  React.useEffect(() => {
    isUploading && onMouseLeave();
  }, [isUploading]);

  return (
    <form onSubmit={handleSubmit}>
      {isVisible && (
        <div
          className={styles.emojiPicker}
          ref={pickerRef}
          style={{ bottom: router.asPath.includes("conversations") ? 75 : 140 }}
        >
          <Picker
            onEmojiClick={({ emoji }) => handleChangeText((text += emoji))}
            emojiStyle={EmojiStyle.GOOGLE}
          />
        </div>
      )}
      <div className={styles.textInputFieldBlock}>
        <div className={styles.textInputField}>
          <div className={styles.textInputFieldContainer}>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                text.length < 255 && handleChangeText(e.target.value)
              }
              ref={innerRef}
              value={text}
              type="text"
              placeholder="Cообщение"
            />
            <Tooltip
              placement="top"
              title="Эмодзи"
              arrow
              className={styles.closeImageButton}
            >
              <IconButton
                className={styles.emojiButton}
                size="small"
                onClick={() => (isVisible ? onMouseLeave() : onMouseOver())}
              >
                <SmileIcon />
              </IconButton>
            </Tooltip>
            {attachedImages?.length < 4 && (
              <AttachImagePopup
                attachedImagesFormData={attachedImagesFormData}
                isUploading={isUploading}
                className={styles.attachImageButton}
                handleChangeAttachedImages={(images, imagesFormData) =>
                  handleChangeAttachedImages(images, imagesFormData)
                }
              />
            )}
          </div>
        </div>
        <IconButton
          type="submit"
          size="large"
          className={styles.sendMessageButton}
          disabled={isUploading}
        >
          {isUploading ? (
            <Oval
              height={20}
              width={20}
              color="#A9A9A9"
              ariaLabel="oval-loading"
              secondaryColor="#A9A9A9"
              strokeWidth={5}
              strokeWidthSecondary={5}
            />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      </div>
      {previews && (
        <ul className={styles.previewsBlock} ref={parent}>
          {previews?.map((preview, index) => (
            <InputPreviewItem
              key={index}
              preview={preview}
              previews={previews}
              handleCloseAttachedImage={(preview) =>
                handleRemoveAttachedImage(preview)
              }
              isUploading={isUploading}
            />
          ))}
        </ul>
      )}
    </form>
  );
};
