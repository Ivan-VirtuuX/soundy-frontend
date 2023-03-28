import React from "react";

import { SearchIcon } from "@/components/ui/Icons/SearchIcon";

import styles from "./SearchInput.module.scss";

export const SearchInput = ({
  placeholder,
  handleChange,
  width,
}: {
  placeholder?: string;
  handleChange?: (text: string) => void;
  width?: number;
}) => {
  const [value, setValue] = React.useState("");

  const onChangeSearchInput = (e) => {
    setValue(e.target.value);

    handleChange(e.target.value);
  };

  return (
    <div className={styles.searchInputBlock}>
      <SearchIcon width={20} height={20} color="#8B8B8B" />
      <input
        type="text"
        value={value}
        onChange={onChangeSearchInput}
        placeholder={placeholder ? placeholder : "Введите запрос"}
        style={{ width: width ? width : 400 }}
      />
    </div>
  );
};
