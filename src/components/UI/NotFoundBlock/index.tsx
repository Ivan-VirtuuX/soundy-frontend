import React from "react";
import styles from "./NotFoundBlock.module.scss";
import Image from "next/image";
import errorSticker from "@/images/errorSticker.png";
import stopSticker from "@/images/stopSticker.png";

export const NotFoundBlock = ({ text }: { text: string }) => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>{text}</p>
      <div className={styles.imagesBlock}>
        <Image quality={100} src={errorSticker} alt="errorSticker" />
        <Image quality={100} src={stopSticker} alt="stopSticker" />
      </div>
    </div>
  );
};
