import styles from "./PageTitle.module.scss";

export const PageTitle = ({ pageTitle }: { pageTitle: string }) => {
  return <h2 className={styles.pageTitle}>{pageTitle}</h2>;
};
