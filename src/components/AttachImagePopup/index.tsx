import React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
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
}

export const AttachImagePopup: React.FC<AttachImagePopupProps> = ({
  className,
  handleChangeAttachedImages,
}) => {
  const [isChangeAttachImageOpen, setIsChangeAttachImageOpen] =
    React.useState(false);
  const [attachedImagesFormData, setAttachedImageFormData] = React.useState<
    FormData[]
  >([]);
  const [attachedImages, setAttachedImages] = React.useState<File[]>([]);
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [previews, setPreviews] = React.useState<string[]>([]);

  const attachedImageRef = React.useRef(null);

  const onCloseImage = async () => {
    await setIsChangeAttachImageOpen(false);
    await setIsSaveImage(false);
    await setAttachedImageFormData(null);
    await setAttachedImageFormData(null);
    await setAttachedImages([]);
    await setPreviews([]);
  };

  const handleChangeImage = async (files) => {
    try {
      const formData: any = new FormData();

      formData.append("file", files[0]);
      formData.append("upload_preset", "cqxjdiz4");

      setAttachedImageFormData(formData);

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
    if (isSaveImage) setIsChangeAttachImageOpen(true);

    if (attachedImages.length !== 0) {
      for (let i: number = 0; i < attachedImages.length; i++) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreviews([...previews, reader.result as string]);
        };

        reader.readAsDataURL(attachedImages[i]);
      }
    } else {
      setPreviews([]);
    }
  }, [attachedImages]);

  return (
    <>
      <IconButton
        size="small"
        className={className}
        onClick={() => attachedImageRef?.current?.click()}
      >
        <input
          accept="image/*"
          ref={attachedImageRef}
          type="file"
          onChange={(e) => handleChangeImage(e.target.files)}
          hidden
        />
        <AttachImageIcon />
      </IconButton>
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
            {previews[previews.length - 1] && (
              <Image
                width={200}
                height={200}
                quality={100}
                className={styles.preview}
                src={previews[previews.length - 1]}
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
