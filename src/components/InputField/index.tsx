import React, { FormEvent } from "react";

import Image from "next/image";

import { AttachImagePopup } from "@/components/AttachImagePopup";
import { SendIcon } from "@/components/ui/Icons/SendIcon";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";

import { IconButton } from "@mui/material";

import styles from "./InputField.module.scss";
import { EmojiStyle } from "emoji-picker-react";
import dynamic from "next/dynamic";
import { SmileIcon } from "@/components/ui/Icons/SmileIcon";
import { useClickOutside } from "@/hooks/useClickOutside";

interface InputFieldProps {
  innerRef?: React.Ref<HTMLInputElement>;
  text: string;
  handleChangeText: (text: string) => void;
  handleChangeAttachedImage: (image: File, imageFormData: FormData) => void;
  handleChangeAttachedImageFormData: (data: FormData) => void;
  handleChangeAttachImage: (image: File) => void;
  isUploading?: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  attachedImage: File;
  preview: string;
  handleChangePreview: (preview: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  innerRef,
  text,
  handleChangeText,
  handleChangeAttachedImage,
  handleChangeAttachedImageFormData,
  handleChangeAttachImage,
  isUploading,
  handleSubmit,
  attachedImage,
  preview,
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
    if (attachedImage) {
      const reader = new FileReader();

      reader.onloadend = () => {
        handleChangePreview(reader.result as string);
      };

      reader.readAsDataURL(attachedImage);
    } else {
      handleChangePreview("");
    }
  }, [attachedImage]);

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
              handleChangeAttachedImage={(image, imageFormData) =>
                handleChangeAttachedImage(image, imageFormData)
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
      {preview && (
        <div style={{ marginTop: preview ? 20 : 0 }}>
          <div className={styles.previewBlock}>
            <Image
              width={100}
              height={100}
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
        </div>
      )}
    </form>
  );
};
