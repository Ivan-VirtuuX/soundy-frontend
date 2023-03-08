import React from "react";

import { Dialog, DialogContent, DialogContentText } from "@mui/material";

import { EditProfileForm } from "@/components/EditProfileForm";

import { ChangeUserDataDto } from "@/api/types";

import styles from "./EditProfilePopup.module.scss";

interface EditProfilePopupProps {
  isEditProfileVisible: boolean;
  localName: string;
  localSurname: string;
  localBirthDate: Date;
  onEditProfile: (data: ChangeUserDataDto) => void;
  handleClose: () => void;
}

export const EditProfilePopup: React.FC<EditProfilePopupProps> = ({
  isEditProfileVisible,
  localName,
  localSurname,
  localBirthDate,
  onEditProfile,
  handleClose,
}) => {
  return (
    <Dialog
      open={isEditProfileVisible}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      style={{ zIndex: 10000 }}
    >
      <DialogContent>
        <DialogContentText >
          <h2 className={styles.editAvatarTitle}>Редактирование профиля</h2>
          <EditProfileForm
            name={localName}
            surname={localSurname}
            birthDate={new Date(localBirthDate)}
            handleSubmit={onEditProfile}
          />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
