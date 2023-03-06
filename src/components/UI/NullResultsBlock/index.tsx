import Image from "next/image";

import crySticker from "@/images/crySticker.png";

import React from "react";

import styles from "./NullResultsBlock.module.scss";

export const NullResultsBlock = ({ text }: { text: string }) => {
  return (
    <div className={styles.container}>
      <p>{text}</p>
      <Image quality={100} src={crySticker} alt="crySticker" />
    </div>
  );
};
