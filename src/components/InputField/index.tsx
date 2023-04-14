import React, { FormEvent } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { AttachImagePopup } from "@/components/AttachImagePopup";
import { SendIcon } from "@/components/ui/Icons/SendIcon";
import { SmileIcon } from "@/components/ui/Icons/SmileIcon";
import { InputPreviewItem } from "@/components/InputPreviewItem";

import { IconButton } from "@mui/material";

import { EmojiStyle } from "emoji-picker-react";

import { useClickOutside } from "@/hooks/useClickOutside";

import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

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
            {attachedImages.length <= 5 && (
              <AttachImagePopup
                className={styles.attachImageButton}
                handleChangeAttachedImages={(image, imageFormData) =>
                  handleChangeAttachedImages(image, imageFormData)
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
          <SendIcon />
        </IconButton>
      </div>
      {previews && (
        <div className={styles.previewsBlock}>
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
        </div>
      )}
    </form>
  );
};
