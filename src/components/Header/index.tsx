import Image from "next/image";
import { useRouter } from "next/router";

import logoText from "@/public/images/logoText.svg";

import styles from "./Header.module.scss";

export const Header = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Image
          src={logoText}
          alt="logo"
          quality={100}
          onClick={() => router.push("/posts")}
        />
      </div>
    </div>
  );
};
