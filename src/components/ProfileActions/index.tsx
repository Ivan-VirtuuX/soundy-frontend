import React from "react";

import { useRouter } from "next/router";

import { ChangeUserDataDto, IUser } from "@/api/types";
import { Api } from "@/api/index";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { EditProfilePopup } from "@/components/EditProfilePopup";
import { DeleteUserIcon } from "@/components/ui/Icons/DeleteUserIcon";
import { EditUserIcon } from "@/components/ui/Icons/EditUserIcon";
import { MessageIcon } from "@/components/ui/Icons/MessageIcon";
import { AddUserIcon } from "@/components/ui/Icons/AddUserIcon";
import { BlueButton } from "@/components/ui/BlueButton";
import { PencilIcon } from "@/components/ui/Icons/PencilIcon";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";

import styles from "./ProfileActions.module.scss";

interface ProfileActionsProps {
  isEditProfileVisible: boolean;
  localName: string;
  localSurname: string;
  localBirthDate: Date;
  onOpenEdit: () => void;
  onCloseEdit: () => void;
  friends: IUser[];
  handleAddFriend: (isAdd: boolean) => void;
  isAddFriend: boolean;
  isLoadingConversation: boolean;
  handleChangeName: (text: string) => void;
  handleChangeSurname: (text: string) => void;
  handleChangeBirthDate: (date: Date) => void;
  handleClickMessageButton: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditProfileVisible,
  localName,
  localSurname,
  localBirthDate,
  onOpenEdit,
  onCloseEdit,
  friends,
  handleAddFriend,
  isAddFriend,
  isLoadingConversation,
  handleChangeName,
  handleChangeSurname,
  handleChangeBirthDate,
  handleClickMessageButton,
}) => {
  const [isLoadingUserAction, setIsLoadingUserAction] = React.useState(false);
  const [isDeleteFriend, setIsDeleteFriend] = React.useState(false);

  const userData = useAppSelector(selectUserData);

  const { query } = useRouter();

  const router = useRouter();

  const onEditProfile = (data: ChangeUserDataDto) => {
    onCloseEdit();
    handleChangeName(data.name);
    handleChangeSurname(data.surname);
    handleChangeBirthDate(data.birthDate);
  };

  const addFriend = async () => {
    try {
      setIsLoadingUserAction(true);

      await Api().user.addFriendRequests(query?.id);

      handleAddFriend(true);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  const deleteFriend = async () => {
    try {
      setIsLoadingUserAction(true);

      await Api().user.deleteFriend(userData.userId, query?.id);

      setIsDeleteFriend(true);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickCancel = async () => {
    try {
      setIsLoadingUserAction(true);

      await Api().user.cancelFriendRequest(userData.userId, query?.id);

      handleAddFriend(false);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className={styles.profileActionsBlock}>
      {userData.userId === query?.id && (
        <>
          <BlueButton handleClick={onOpenEdit} size="sm" text="Редактировать">
            <EditUserIcon />
          </BlueButton>
          <EditProfilePopup
            handleClose={onCloseEdit}
            onEditProfile={onEditProfile}
            isEditProfileVisible={isEditProfileVisible}
            localName={localName}
            localSurname={localSurname}
            localBirthDate={localBirthDate}
          />
        </>
      )}
      {userData.userId !== query?.id && (
        <BlueButton
          size="sm"
          text="Сообщение"
          handleClick={handleClickMessageButton}
          disabled={isLoadingConversation}
        >
          <MessageIcon width={15} height={15} color="white" />
        </BlueButton>
      )}
      {userData.userId === query?.id && (
        <BlueButton
          handleClick={() => router.push("/write")}
          size="sm"
          text="Создать пост"
        >
          <PencilIcon />
        </BlueButton>
      )}

      {friends.find((friend) => friend.userId === userData.userId) &&
      !isDeleteFriend ? (
        <BlueButton
          size="sm"
          text="Удалить"
          handleClick={deleteFriend}
          disabled={isLoadingUserAction}
        >
          <DeleteUserIcon />
        </BlueButton>
      ) : query?.id !== userData.userId && isAddFriend ? (
        <BlueButton
          handleClick={onClickCancel}
          size="sm"
          text="Отклонить"
          color="primary"
          disabled={isLoadingUserAction}
        >
          <CrossIcon />
        </BlueButton>
      ) : (
        query?.id !== userData.userId &&
        !friends.find((friend) => friend.userId === query?.id) &&
        !isAddFriend && (
          <BlueButton
            size="sm"
            text="Добавить"
            handleClick={addFriend}
            disabled={isLoadingUserAction}
          >
            <AddUserIcon />
          </BlueButton>
        )
      )}
    </div>
  );
};
