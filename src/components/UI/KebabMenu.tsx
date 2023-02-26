import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { MoreHoriz } from "@material-ui/icons";

const options = ["Удалить"];

const ITEM_HEIGHT = 48;

export const KebabMenu = ({ handleDelete }: { handleDelete: () => void }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClickDelete = () => {
    handleDelete();
    setAnchorEl(null);
  };

  return (
    <div>
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
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === "Удалить"}
            onClick={
              option === "Удалить" ? onClickDelete : () => setAnchorEl(null)
            }
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
