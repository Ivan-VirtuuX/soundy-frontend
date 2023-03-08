import React from "react";
import { useInView } from "react-intersection-observer";
import { InfinitySpin } from "react-loader-spinner";

import { UserItem } from "@/components/UserItem";
import { NotFoundBlock } from "@/components/UI/NotFoundBlock";

import { Button } from "@material-ui/core";

import { Api } from "@/api/index";
import { IUser } from "@/api/types";

import styles from "./SearchedUsers.module.scss";

interface SearchedUsersProps {
  searchUserQuery: string;
  handleLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  handleSearchedUsers: (users: IUser[]) => void;
  searchedUsers: IUser[];
  handleChangeUsersPage: () => void;
  page: number;
  isEmptyResults: boolean;
}

export const SearchedUsers: React.FC<SearchedUsersProps> = ({
  searchUserQuery,
  handleLoading,
  isLoading,
  handleSearchedUsers,
  searchedUsers,
  handleChangeUsersPage,
  page,
  isEmptyResults,
}) => {
  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const loadMoreResults = React.useCallback(
    async (pageNumber) => {
      try {
        if (searchUserQuery) {
          const splitSearchUsers = searchUserQuery.split(" ");

          if (splitSearchUsers.length === 2) {
            handleLoading(true);

            const data = await Api().user.findUsers(
              {
                _name: splitSearchUsers[0],
                _surname: splitSearchUsers[1],
              },
              pageNumber
            );

            handleSearchedUsers([...searchedUsers.concat(data)]);

            handleLoading(false);

            handleChangeUsersPage();
          } else if (splitSearchUsers.length === 1) {
            handleLoading(true);

            const data = await Api().user.findUsers(
              {
                _query: splitSearchUsers[0],
              },
              pageNumber
            );

            handleSearchedUsers([...searchedUsers.concat(data)]);

            handleLoading(false);

            handleChangeUsersPage();
          }
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [
      handleChangeUsersPage,
      handleLoading,
      handleSearchedUsers,
      searchUserQuery,
      searchedUsers,
    ]
  );

  React.useEffect(() => {
    (async () => {
      try {
        if (inView && page !== 1) {
          handleLoading(true);

          await loadMoreResults(page);

          handleLoading(false);
        }
      } catch (err) {
        console.warn(err);
      } finally {
        handleLoading(false);
      }
    })();
  }, [inView]);

  return (
    <>
      {searchedUsers && (
        <div
          className={styles.searchedUsersBlock}
          style={{
            gridTemplateColumns: searchedUsers?.length < 3 && "1fr",
          }}
        >
          {searchedUsers.map((user) => (
            <UserItem key={user.userId} {...user} menuHidden innerRef={ref} />
          ))}
        </div>
      )}
      {isLoading && (
        <div>
          <InfinitySpin width="200" color="#181F92" />
        </div>
      )}
      {page === 1 && searchedUsers.length > 0 && !isLoading && (
        <Button onClick={() => loadMoreResults(2)} variant="outlined">
          Загрузить еще...
        </Button>
      )}
      {isEmptyResults && (
        <NotFoundBlock text="По данному запросу ничего не найдено" />
      )}
    </>
  );
};
