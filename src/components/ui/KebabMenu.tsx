import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { MoreHoriz } from "@material-ui/icons";

interface KebabMenuProps {
  handleDelete?: () => void;
  handlePin?: () => void;
  handleUnpin?: () => void;
  isPinned?: boolean;
  isVisiblePin?: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export const KebabMenu: React.FC<KebabMenuProps> = ({
  handleDelete,
  handlePin,
  handleUnpin,
  isPinned,
  isVisiblePin,
  innerRef,
  className,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickDelete = () => {
    handleDelete();
    setAnchorEl(null);
  };

  const onClickPin = () => {
    handlePin();
    setAnchorEl(null);
  };

  const onClickUnpin = () => {
    handleUnpin();
    setAnchorEl(null);
  };

  return (
    <div ref={innerRef} className={className}>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        color="primary"
      >
        <MoreHoriz color="primary" />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={onClickDelete}>Удалить</MenuItem>
        {isVisiblePin &&
          (isPinned ? (
            <MenuItem onClick={onClickUnpin}>Открепить</MenuItem>
          ) : (
            <MenuItem onClick={onClickPin}>Закрепить</MenuItem>
          ))}
      </Menu>
    </div>
  );
};
