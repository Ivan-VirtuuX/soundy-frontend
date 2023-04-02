import React from "react";

import Image from "next/image";

import { IconButton, Tooltip } from "@mui/material";

import { CrossIcon } from "@/components/ui/Icons/CrossIcon";

import { useTransitionOpacity } from "@/hooks/useTransitionOpacity";

import styles from "./InputPreviewItem.module.scss";

interface InputPreviewItemProps {
  preview: string;
  previews: string[];
  handleCloseAttachedImage: (preview: string) => void;
}

export const InputPreviewItem: React.FC<InputPreviewItemProps> = ({
  preview,
  previews,
  handleCloseAttachedImage,
}) => {
  const closeImageButtonRef = React.useRef(null);

  const { isVisible, onMouseOver, onMouseLeave } =
    useTransitionOpacity(closeImageButtonRef);

  return (
    <div
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      style={{ marginTop: preview ? 20 : 0 }}
      className={styles.previewBlock}
    >
      <Image
        style={{
          width: previews.length >= 4 ? 50 : 100,
          height: previews.length >= 4 ? 50 : 100,
        }}
        width={previews.length >= 4 ? 50 : 100}
        height={previews.length >= 4 ? 50 : 100}
        quality={100}
        className={styles.preview}
        src={preview}
        alt="image preview"
      />
      {isVisible && (
        <Tooltip
          ref={closeImageButtonRef}
          placement="top"
          title="Удалить"
          arrow
          className={styles.closeImageButton}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleCloseAttachedImage(preview)}
          >
            <CrossIcon color="#fff" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};
