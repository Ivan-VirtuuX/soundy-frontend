import React from "react";
import styles from "./ProfileActions.module.scss";
import { BlueButton } from "@/components/UI/BlueButton";
import { EditUserIcon } from "@/components/UI/Icons/EditUserIcon";
import { EditProfilePopup } from "@/components/EditProfilePopup";
import { MessageIcon } from "@/components/UI/Icons/MessageIcon";
import { PencilIcon } from "@/components/UI/Icons/PencilIcon";
import { DeleteUserIcon } from "@/components/UI/Icons/DeleteUserIcon";
import { CrossIcon } from "@/components/UI/Icons/CrossIcon";
import { AddUserIcon } from "@/components/UI/Icons/AddUserIcon";
import { useAppSelector } from "@/redux/hooks";
import { selectUserData } from "@/redux/slices/user";
import { useRouter } from "next/router";
import { ChangeUserDataDto, IUser } from "@/api/types";
import { Api } from "@/api/index";

interface ProfileActionsProps {
  isEditProfileVisible: boolean;
  localName: string;
  localSurname: string;
  localBirthDate: Date;
  handleChangeName: (text: string) => void;
  handleChangeSurname: (text: string) => void;
  handleChangeBirthDate: (date: Date) => void;
  onOpenEdit: () => void;
  onCloseEdit: () => void;
  friends: IUser[];
  handleAddFriend: (isAdd: boolean) => void;
  isAddFriend: boolean;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditProfileVisible,
  localName,
  localSurname,
  localBirthDate,
  handleChangeName,
  handleChangeSurname,
  handleChangeBirthDate,
  onOpenEdit,
  onCloseEdit,
  friends,
  handleAddFriend,
  isAddFriend,
}) => {
  const [isDeleteFriend, setIsDeleteFriend] = React.useState(false);
  const [isLoadingUserAction, setIsLoadingUserAction] = React.useState(false);

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

      await Api().user.deleteFriend(userData?.id, query?.id);

      setIsDeleteFriend(true);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickCancel = async () => {
    try {
      setIsLoadingUserAction(true);

      await Api().user.cancelFriendRequest(userData?.id, query?.id);

      handleAddFriend(false);

      setIsLoadingUserAction(false);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className={styles.profileActionsBlock}>
      {userData?.id === query?.id && (
        <>
          <BlueButton handleClick={onOpenEdit} size="sm" text="??????????????????????????">
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
      {userData?.id !== query?.id && (
        <BlueButton size="sm" text="??????????????????">
          <MessageIcon width={15} height={15} color="white" />
        </BlueButton>
      )}
      {userData?.id === query?.id && (
        <BlueButton
          handleClick={() => router.push("/write")}
          size="sm"
          text="?????????????? ????????"
        >
          <PencilIcon />
        </BlueButton>
      )}

      {friends.find((friend) => friend.userId === userData?.id) &&
      !isDeleteFriend ? (
        <BlueButton
          size="sm"
          text="??????????????"
          handleClick={deleteFriend}
          disabled={isLoadingUserAction}
        >
          <DeleteUserIcon />
        </BlueButton>
      ) : query?.id !== userData?.id && isAddFriend ? (
        <BlueButton
          handleClick={onClickCancel}
          size="sm"
          text="??????????????????"
          color="primary"
          disabled={isLoadingUserAction}
        >
          <CrossIcon />
        </BlueButton>
      ) : (
        query?.id !== userData?.id &&
        !friends.find((friend) => friend.userId === query?.id) &&
        !isAddFriend && (
          <BlueButton
            size="sm"
            text="????????????????"
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
