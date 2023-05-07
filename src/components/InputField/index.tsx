import React, { FormEvent } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { AttachImagePopup } from "@/components/AttachImagePopup";
import { SmileIcon } from "@/components/ui/Icons/SmileIcon";
import { InputPreviewItem } from "@/components/InputPreviewItem";

import { IconButton } from "@mui/material";

import { EmojiStyle } from "emoji-picker-react";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import styles from "./InputField.module.scss";
import { Oval } from "react-loader-spinner";
import { SendIcon } from "../ui/Icons/SendIcon";

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
    if (attachedImages?.length !== 0) {
      for (let i: number = 0; i < attachedImages?.length; i++) {
        const reader = new FileReader();

        reader.onloadend = () => {
          handleChangePreview(reader.result as string);
        };

        reader?.readAsDataURL(attachedImages[i]);
      }
    }
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
            <IconButton
              className={styles.emojiButton}
              size="small"
              onClick={() => (isVisible ? onMouseLeave() : onMouseOver())}
            >
              <SmileIcon />
            </IconButton>
            {attachedImages?.length < 5 && (
              <AttachImagePopup
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
              color="#181F92"
              ariaLabel="oval-loading"
              secondaryColor="#2831C0"
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
            />
          ))}
        </ul>
      )}
    </form>
  );
};
