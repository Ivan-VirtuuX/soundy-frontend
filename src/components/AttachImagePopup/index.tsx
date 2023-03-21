import React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";

import { BlueButton } from "@/components/UI/BlueButton";

import styles from "./AttachImagePopup.module.scss";
import { CloudinaryApi } from "@/api/CloudinaryApi";
import { AttachImageIcon } from "@/components/UI/Icons/AttachImageIcon";
import Image from "next/image";

interface AttachImagePopupProps {
  handleChangeAvatar: (avatarUrl: string) => void;
  className: string;
  handleChangeAttachedImage: (image: File, imageFormData: FormData) => void;
}

export const AttachImagePopup: React.FC<AttachImagePopupProps> = ({
  handleChangeAvatar,
  className,
  handleChangeAttachedImage,
}) => {
  const [attachedImageFormData, setAttachedImageFormData] =
    React.useState<FormData>(null);
  const [isChangeAttachImageOpen, setIsChangeAttachImageOpen] =
    React.useState(false);
  const [attachedImage, setAttachedImage] = React.useState<File>();
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState("");

  const onCloseImage = async () => {
    await setAttachedImageFormData(null);
    await setAttachedImageFormData(null);
    await setAttachedImage(undefined);
    await setIsSaveImage(false);
    await setPreview("");
    await setIsChangeAttachImageOpen(false);
  };

  const attachedImageRef = React.useRef(null);

  const onChangeImage = () => attachedImageRef?.current?.click();

  const onSubmitAttachedImage = async () => {
    try {
      setIsUploading(true);

      const { data } = await CloudinaryApi().cloudinary.changeImage(
        attachedImageFormData
      );

      setIsUploading(false);

      handleChangeAvatar(data.secure_url);

      return data;
    } catch (err) {
      console.warn(err);

      alert("Update image error");
    } finally {
      setIsSaveImage(false);
      setIsUploading(false);
      setIsChangeAttachImageOpen(false);
    }
  };

  const handleChangeImage = async (files) => {
    try {
      const formData: any = new FormData();

      formData.append("file", files[0]);
      formData.append("upload_preset", "cqxjdiz4");

      setAttachedImageFormData(formData);

      setAttachedImage(files[0]);

      files && setIsSaveImage(true);
    } catch (err) {
      console.warn(err);

      alert("Ошибка при загрузке файла");
    }
  };

  const onClickAttachImageButton = () => onChangeImage();

  const onClickSaveAttachImage = () => {
    setIsChangeAttachImageOpen(false);

    handleChangeAttachedImage(attachedImage, attachedImageFormData);
  };

  React.useEffect(() => {
    if (isSaveImage) setIsChangeAttachImageOpen(true);
  }, [attachedImage]);

  React.useEffect(() => {
    if (attachedImage) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(attachedImage);
    } else {
      setPreview(null);
    }
  }, [attachedImage]);

  return (
    <>
      <div>
        <IconButton
          size="small"
          className={className}
          onClick={onClickAttachImageButton}
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
      </div>
      <Dialog
        open={isChangeAttachImageOpen}
        onClose={() => setIsChangeAttachImageOpen(false)}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: 10000 }}
      >
        <DialogContent>
          <DialogContentText className={styles.popupContainer}>
            <h2 className={styles.popupTitle}>Отправка изображения</h2>
            {preview && (
              <Image
                width={200}
                height={200}
                quality={100}
                className={styles.preview}
                src={preview}
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
