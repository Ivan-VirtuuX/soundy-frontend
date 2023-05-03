import React from "react";

import { useRouter } from "next/router";

import { ChangeUserDataDto, IUser } from "@/api/types";
import { Api } from "@/api";

import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";

import { EditProfilePopup } from "@/components/EditProfilePopup";
import { DeleteUserIcon } from "@/components/ui/Icons/DeleteUserIcon";
import { CheckMarkIcon } from "@/components/ui/Icons/CheckMarkIcon";
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
  const [localFriendRequests, setLocalFriendRequests] = React.useState<IUser[]>(
    []
  );
  const [localFriends, setLocalFriends] = React.useState<IUser[]>(friends);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [isFriend, setIsFriend] = React.useState(false);

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

      await Api().user.deleteFriend(userData?.userId, query?.id);

      setIsFriend(false);

      setIsLoadingUserAction(false);

      setLocalFriends([
        ...localFriends.filter((friend) => friend.userId !== userData?.userId),
      ]);

      setIsConfirmed(false);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickCancel = async () => {
    try {
      setIsLoadingUserAction(true);

      await Api().user.cancelFriendRequest(query.id, userData?.userId);

      handleAddFriend(false);

      setIsLoadingUserAction(false);

      setLocalFriendRequests([
        ...localFriendRequests.filter(
          (reqFriend) => reqFriend.userId !== query.id
        ),
      ]);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickAccept = async () => {
    try {
      const newFriend = await Api().user.confirmFriendRequest(
        userData?.userId,
        query.id
      );

      setIsConfirmed(true);

      setLocalFriends([...localFriends, newFriend]);

      setLocalFriendRequests([
        ...localFriendRequests.filter(
          (reqFriend) => reqFriend.userId !== query.id
        ),
      ]);
    } catch (err) {
      console.warn(err);
    }
  };

  React.useEffect(() => {
    setLocalFriends(friends);
    setLocalFriendRequests(userData.friendRequests);
  }, []);

  React.useEffect(() => {
    localFriends.find((friend) => friend.userId === userData?.userId) &&
      setIsFriend(true);
  }, []);

  return (
    <div className={styles.profileActionsBlock}>
      {userData?.userId === query?.id && (
        <>
          <BlueButton
            handleClick={onOpenEdit}
            size="sm"
            text="Редактировать"
            width={180}
          >
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
      {userData?.userId !== query?.id && (
        <BlueButton
          size="sm"
          text="Сообщение"
          handleClick={handleClickMessageButton}
          disabled={isLoadingConversation}
          width={180}
        >
          <MessageIcon width={15} height={15} color="white" />
        </BlueButton>
      )}
      {userData?.userId === query?.id && (
        <BlueButton
          handleClick={() => router.push("/write")}
          size="sm"
          text="Создать пост"
          width={180}
        >
          <PencilIcon />
        </BlueButton>
      )}
      {(isFriend ||
        isConfirmed ||
        localFriends.find((friend) => friend.userId === userData?.userId)) &&
      query.id !== userData?.userId ? (
        <BlueButton
          size="sm"
          text="Удалить"
          handleClick={deleteFriend}
          disabled={isLoadingUserAction}
          width={180}
        >
          <DeleteUserIcon />
        </BlueButton>
      ) : query?.id !== userData?.userId && isAddFriend ? (
        <BlueButton
          handleClick={onClickCancel}
          size="sm"
          text="Отклонить"
          color="primary"
          disabled={isLoadingUserAction}
          width={180}
        >
          <CrossIcon />
        </BlueButton>
      ) : query?.id !== userData?.userId &&
        localFriendRequests.find(
          (reqFriend) => reqFriend.userId === query.id
        ) &&
        !localFriends.find((friend) => friend.userId === userData?.userId) ? (
        <>
          <BlueButton
            size="sm"
            text="Принять заявку"
            handleClick={onClickAccept}
            disabled={isLoadingUserAction}
            width={180}
          >
            <CheckMarkIcon color="#fff" />
          </BlueButton>
          <BlueButton
            size="sm"
            text="Отклонить заявку"
            handleClick={onClickCancel}
            disabled={isLoadingUserAction}
            width={180}
          >
            <CrossIcon />
          </BlueButton>
        </>
      ) : (
        query.id !== userData?.userId &&
        !localFriends.find((friend) => friend.userId === query?.id) &&
        !isAddFriend &&
        !isConfirmed && (
          <BlueButton
            size="sm"
            text="Добавить"
            handleClick={addFriend}
            disabled={isLoadingUserAction}
            width={180}
          >
            <AddUserIcon />
          </BlueButton>
        )
      )}
    </div>
  );
};
