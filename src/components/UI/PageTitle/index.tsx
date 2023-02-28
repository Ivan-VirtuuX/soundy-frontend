import styles from "./PageTitle.module.scss";

export const PageTitle = ({
  pageTitle,
  marginBottom,
  marginTop,
}: {
  pageTitle: string;
  marginBottom?: number;
  marginTop?: number;
}) => {
  return (
    <h2
      className={styles.pageTitle}
      style={{
        marginBottom: marginBottom ? marginBottom : 10,
        marginTop: marginTop ? marginTop : 10,
      }}
    >
      {pageTitle}
    </h2>
  );
};
