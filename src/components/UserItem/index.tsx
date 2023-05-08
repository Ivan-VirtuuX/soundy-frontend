import React from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import { EmptyAvatar } from "@/components/ui/EmptyAvatar";
import { BlueButton } from "@/components/ui/BlueButton";
import { PlusIcon } from "@/components/ui/Icons/PlusIcon";
import { CrossIcon } from "@/components/ui/Icons/CrossIcon";
import { MessageIcon } from "@/components/ui/Icons/MessageIcon";
import { CheckMarkIcon } from "@/components/ui/Icons/CheckMarkIcon";

import { Api } from "@/api";

import { truncateString } from "@/utils/truncateString";

import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { useLongPress } from "use-long-press";

import styles from "./UserItem.module.scss";

interface UserItemProps {
  userId: string;
  avatarUrl: string;
  name: string;
  surname: string;
  login: string;
  handleDelete?: (userId: string) => void;
  type?: string;
  handleAccept?: (userId: string) => void;
  handleCancel?: (userId: string) => void;
  isConfirmed?: boolean;
  isCancelled?: boolean;
  menuHidden?: boolean;
}

export const UserItem: React.FC<UserItemProps> = ({
  avatarUrl,
  name,
  surname,
  userId,
  login,
  handleDelete,
  type,
  handleAccept,
  handleCancel,
  isConfirmed,
  isCancelled,
  menuHidden,
}) => {
  const [isLoadingConversation, setIsLoadingConversation] =
    React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const router = useRouter();

  const containerRef = React.useRef(null);

  const onShowMessageActions = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    setAnchorEl(containerRef.current);
  };

  const bind = useLongPress((e: React.MouseEvent<HTMLDivElement>) =>
    onShowMessageActions(e)
  );

  const createConversation = async () => {
    try {
      setIsLoadingConversation(true);

      const data = await Api().conversation.createConversation({
        receiver: userId,
      });

      await router.push(`/conversations/${data.conversationId}`);

      setIsLoadingConversation(false);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleDelete(userId)}>Удалить</MenuItem>
      </Menu>
      <div
        onContextMenu={
          type !== "requestFriends" && !menuHidden && onShowMessageActions
        }
        className={styles.container}
        style={{
          marginTop: type === "requestFriends" && 20,
        }}
        {...bind()}
        ref={containerRef}
      >
        <div className={styles.leftSide}>
          {avatarUrl ? (
            <Link href={`/users/${userId}`}>
              <img className={styles.avatar} src={avatarUrl} alt="avatar" />
            </Link>
          ) : (
            <Link href={`/users/${userId}`}>
              <EmptyAvatar className={styles.avatar} width={80} />
            </Link>
          )}
          <div className={styles.userInfoBlock}>
            <Link href={`/users/${userId}`}>
              <div className={styles.nameSurnameBlock}>
                <span className={styles.name}>{name}</span>
                <span className={styles.surname}>
                  {truncateString(surname, 10)}
                </span>
              </div>
              <Link href={`/users/${userId}`}>
                <span className={styles.login}>{login}</span>
              </Link>
            </Link>
            {type === "requestFriends" ? (
              <div className={styles.requestFriendActionsBlock}>
                {!isConfirmed && (
                  <BlueButton
                    handleClick={() => handleAccept(userId)}
                    size="sm"
                    text="Принять"
                    color="primary"
                  >
                    <PlusIcon />
                  </BlueButton>
                )}
                {isCancelled ? (
                  <BlueButton
                    disabled
                    size="sm"
                    text="Отклонена"
                    color="primary"
                  >
                    <CheckMarkIcon />
                  </BlueButton>
                ) : (
                  <BlueButton
                    handleClick={() => handleCancel(userId)}
                    size="sm"
                    text="Отклонить"
                    color="primary"
                  >
                    <CrossIcon />
                  </BlueButton>
                )}
              </div>
            ) : (
              <BlueButton
                size="sm"
                text="Сообщение"
                color="primary"
                handleClick={createConversation}
                disabled={isLoadingConversation}
              >
                <MessageIcon width={18} height={18} color="white" />
              </BlueButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
