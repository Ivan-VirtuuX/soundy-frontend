import React from "react";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";

import { BlueButton } from "@/components/UI/BlueButton";
import { CameraIcon } from "@/components/UI/Icons/CameraIcon";

import { CloudinaryApi } from "@/api/CloudinaryApi";
import { Api } from "@/api/index";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import styles from "./ChangeAvatarPopup.module.scss";

interface ChangeAvatarPopupProps {
  handleChangeAvatar: (avatarUrl: string) => void;
}

export const ChangeAvatarPopup: React.FC<ChangeAvatarPopupProps> = ({
  handleChangeAvatar,
}) => {
  const [attachedImageFormData, setAttachedImageFormData] = React.useState([]);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = React.useState(false);
  const [attachedImage, setAttachedImage] = React.useState<File>();
  const [isSaveImage, setIsSaveImage] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [preview, setPreview] = React.useState("");

  const userData = useAppSelector(selectUserData);

  const onCloseImage = async () => {
    await setAttachedImageFormData([]);
    await setAttachedImageFormData([]);
    await setAttachedImage(undefined);
    await setIsSaveImage(false);
    await setPreview("");
    await setIsChangeAvatarOpen(false);
  };

  const attachedImageRef = React.useRef(null);

  const onChangeImage = () => attachedImageRef?.current?.click();

  const onSubmitAttachedImage = async () => {
    try {
      setIsUploading(true);

      const { data } = await CloudinaryApi().cloudinary.changeImage(
        attachedImageFormData
      );

      await Api().user.updateAvatar(userData.id, data.secure_url);

      setIsUploading(false);

      handleChangeAvatar(data.secure_url);

      return data;
    } catch (err) {
      console.warn(err);

      alert("Update image error");
    } finally {
      setIsSaveImage(false);
      setIsUploading(false);
      setIsChangeAvatarOpen(false);
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

      alert("???????????? ?????? ???????????????? ??????????");
    }
  };

  const onClickChangeAvatarButton = () => onChangeImage();

  React.useEffect(() => {
    if (isSaveImage) setIsChangeAvatarOpen(true);
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
      <div className={styles.changeAvatarButton}>
        <IconButton
          size="large"
          color="primary"
          onClick={onClickChangeAvatarButton}
        >
          <form>
            <input
              accept="image/*"
              ref={attachedImageRef}
              type="file"
              onChange={(e) => handleChangeImage(e.target.files)}
              hidden
            />
          </form>
          <CameraIcon />
        </IconButton>
      </div>
      <Dialog
        open={isChangeAvatarOpen}
        onClose={() => setIsChangeAvatarOpen(false)}
        fullWidth
        maxWidth="sm"
        style={{ zIndex: 10000 }}
      >
        <DialogContent>
          <DialogContentText className={styles.editAvatarContainer}>
            <h2 className={styles.editAvatarTitle}>???????????????????????????? ??????????????</h2>
            {preview && (
              <img
                className={styles.avatar}
                src={preview}
                alt="image preview"
              />
            )}
            <BlueButton
              text="????????????????"
              handleClick={onCloseImage}
              color="secondary"
            />
            <BlueButton
              text="??????????????????"
              handleClick={onSubmitAttachedImage}
              color="green"
              disabled={isUploading || !preview}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
