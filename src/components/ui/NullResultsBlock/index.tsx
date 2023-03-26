import Image from "next/image";

import crySticker from "@/images/crySticker.png";

import React, { CSSProperties } from "react";

import styles from "./NullResultsBlock.module.scss";

export const NullResultsBlock = ({
  text,
  style,
}: {
  text: string;
  style?: CSSProperties;
}) => {
  return (
    <div className={styles.container} style={style}>
      <p>{text}</p>
      <Image quality={100} src={crySticker} alt="crySticker" />
    </div>
  );
};
