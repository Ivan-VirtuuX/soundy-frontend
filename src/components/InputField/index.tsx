import React, { FormEvent } from "react";

import Image from "next/image";
import dynamic from "next/dynamic";

import { AttachImagePopup } from "@/components/AttachImagePopup";
import { SendIcon } from "@/components/ui/Icons/SendIcon";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";
import { SmileIcon } from "@/components/ui/Icons/SmileIcon";

import { IconButton } from "@mui/material";

import { EmojiStyle } from "emoji-picker-react";

import { useClickOutside } from "@/hooks/useClickOutside";

import styles from "./InputField.module.scss";

interface InputFieldProps {
  innerRef?: React.Ref<HTMLInputElement>;
  text: string;
  handleChangeText: (text: string) => void;
  handleChangeAttachedImages: (
    images: File[],
    imagesFormData: FormData[]
  ) => void;
  handleChangeAttachedImageFormData: (data: FormData) => void;
  handleChangeAttachImage: (image: File) => void;
  isUploading?: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  attachedImages: File[];
  previews: string[];
  handleChangePreview: (preview: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  innerRef,
  text,
  handleChangeText,
  handleChangeAttachedImages,
  handleChangeAttachedImageFormData,
  handleChangeAttachImage,
  isUploading,
  handleSubmit,
  attachedImages,
  previews,
  handleChangePreview,
}) => {
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = React.useState(false);

  const pickerRef = React.useRef(null);

  const Picker = dynamic(
    () => {
      return import("emoji-picker-react");
    },
    { ssr: false }
  );

  useClickOutside(pickerRef, () => setIsEmojiPickerVisible(false));

  const onCancelAttachImage = () => {
    handleChangeAttachedImageFormData(null);
    handleChangeAttachImage(undefined);
    handleChangePreview("");
  };

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
    isUploading && setIsEmojiPickerVisible(false);
  }, [isUploading]);

  return (
    <form onSubmit={handleSubmit}>
      {isEmojiPickerVisible && (
        <div className={styles.emojiPicker} ref={pickerRef}>
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
                handleChangeText(e.target.value)
              }
              ref={innerRef}
              value={text}
              type="text"
              placeholder="Cообщение"
            />
            <IconButton
              className={styles.emojiButton}
              size="medium"
              onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}
            >
              <SmileIcon />
            </IconButton>
            <AttachImagePopup
              className={styles.attachImageButton}
              handleChangeAttachedImages={(image, imageFormData) =>
                handleChangeAttachedImages(image, imageFormData)
              }
            />
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
      <div className={styles.previewBlock}>
        {previews &&
          previews?.map((preview, index) => (
            <div style={{ marginTop: preview ? 20 : 0 }} key={index}>
              <Image
                style={{
                  width: previews.length >= 3 ? 50 : 100,
                  height: previews.length >= 3 ? 50 : 100,
                }}
                width={previews.length >= 3 ? 50 : 100}
                height={previews.length >= 3 ? 50 : 100}
                quality={100}
                className={styles.preview}
                src={preview}
                alt="image preview"
              />
              <IconButton
                color="primary"
                className={styles.closeImageButton}
                onClick={onCancelAttachImage}
              >
                <CrossIcon color="#181F92" />
              </IconButton>
            </div>
          ))}
      </div>
    </form>
  );
};
