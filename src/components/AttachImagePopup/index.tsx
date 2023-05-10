import React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Tooltip,
} from "@mui/material";

import { BlueButton } from "@/components/ui/BlueButton";
import { AttachImageIcon } from "@/components/ui/Icons/AttachImageIcon";

import Image from "next/image";

import styles from "./AttachImagePopup.module.scss";

interface AttachImagePopupProps {
  className: string;
  handleChangeAttachedImages: (
    images: File[],
    imagesFormData: FormData[]
  ) => void;
  isUploading: boolean;
  attachedImagesFormData: FormData[];
}

export const AttachImagePopup: React.FC<AttachImagePopupProps> = ({
  className,
  handleChangeAttachedImages,
  isUploading,
  attachedImagesFormData,
}) => {
  const [isChangeAttachImageOpen, setIsChangeAttachImageOpen] =
    React.useState(false);
  const [attachedImages, setAttachedImages] = React.useState<File[]>([]);
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [previews, setPreviews] = React.useState<string[]>([]);

  const attachedImageRef = React.useRef(null);

  const onCloseImage = async () => {
    await setIsChangeAttachImageOpen(false);
    await setIsSaveImage(false);
    await setAttachedImages([]);
    await setPreviews([]);
    await handleChangeAttachedImages([], []);
  };

  const handleChangeImage = async (files: FileList) => {
    try {
      const formData: FormData = new FormData();

      formData.append("file", files[0]);
      formData.append("upload_preset", "cqxjdiz4");

      handleChangeAttachedImages(attachedImages, [
        ...attachedImagesFormData,
        formData,
      ]);

      setAttachedImages([...attachedImages, files[0]]);

      files && setIsSaveImage(true);
    } catch (err) {
      console.warn(err);

      alert("Ошибка при загрузке файла");
    }
  };

  const onClickSaveAttachImage = () => {
    setIsChangeAttachImageOpen(false);

    handleChangeAttachedImages(attachedImages, attachedImagesFormData);
  };

  React.useEffect(() => {
    if (attachedImages.length !== 0) {
      setAttachedImages([]);
      setIsSaveImage(false);
    }
  }, [isUploading]);

  React.useEffect(() => {
    if (isSaveImage) setIsChangeAttachImageOpen(true);

    if (attachedImages?.length !== 0) {
      for (let i: number = 0; i < attachedImages?.length; i++) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreviews([...previews, reader.result as string]);
        };

        attachedImages[i] && reader.readAsDataURL(attachedImages[i]);
      }
    } else {
      setPreviews([]);
    }
  }, [attachedImages]);

  return (
    <>
      <Tooltip
        placement="top"
        title="Прикрепить изображение"
        arrow
        className={styles.closeImageButton}
        style={{ pointerEvents: isUploading ? "none" : "all" }}
      >
        <IconButton
          size="small"
          className={className}
          onClick={() => attachedImageRef?.current?.click()}
        >
          <input
            accept="image/*"
            ref={attachedImageRef}
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChangeImage(e.target.files)
            }
            hidden
          />
          <AttachImageIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={isChangeAttachImageOpen && !!attachedImages}
        onClose={() => setIsChangeAttachImageOpen(false)}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: 10000 }}
      >
        <DialogContent>
          <DialogContentText className={styles.popupContainer}>
            <span className={styles.popupTitle}>Отправка изображения</span>
            {previews.at(-1) && (
              <Image
                width={200}
                height={200}
                quality={100}
                className={styles.preview}
                src={previews.at(-1)}
                alt="image preview"
              />
            )}
            <div className={styles.popupActions}>
              <BlueButton
                text="Отменить"
                handleClick={onCloseImage}
                color="secondary"
                className={styles.button}
              />
              <BlueButton
                text="Сохранить"
                handleClick={onClickSaveAttachImage}
                color="green"
                className={styles.button}
              />
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
