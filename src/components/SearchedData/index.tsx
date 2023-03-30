import React from "react";
import { useInView } from "react-intersection-observer";

import { Api } from "@/api/index";
import { IPost, IUser } from "@/api/types";

import { NotFoundBlock } from "@/components/ui/NotFoundBlock";
import { UserItem } from "@/components/UserItem";
import { Post } from "@/components/Post";

import { Button } from "@material-ui/core";

import styles from "./SearchedData.module.scss";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface SearchedDataProps {
  searchQuery: string;
  handleLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  handleSearchedData: (data: IPost[] | IUser[]) => void;
  searchedData: any;
  handleChangeDataPage: () => void;
  page: number;
  isEmptyResults: boolean;
  type: string;
}

export const SearchedData: React.FC<SearchedDataProps> = ({
  searchQuery,
  handleLoading,
  isLoading,
  handleSearchedData,
  searchedData,
  page,
  isEmptyResults,
  type,
}) => {
  const [isNextButtonVisible, setIsNextButtonVisible] = React.useState(true);
  const [localPage, setLocalPage] = React.useState(1);

  const { ref, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  const [parent] = useAutoAnimate({ disrespectUserMotionPreference: true });

  const loadMoreResults = React.useCallback(
    async (pageNumber) => {
      try {
        if (searchQuery && pageNumber !== 1) {
          if (type === "users") {
            const splitSearchUsers = searchQuery.split(" ");

            if (splitSearchUsers.length === 2) {
              handleLoading(true);

              const data = await Api().user.searchUsers(
                {
                  _name: splitSearchUsers[0],
                  _surname: splitSearchUsers[1],
                },
                pageNumber
              );

              handleSearchedData([...searchedData.concat(data)]);

              handleLoading(false);

              data.length === 9
                ? setLocalPage((localPage) => localPage + 1)
                : setLocalPage(0);
            } else if (splitSearchUsers.length === 1) {
              handleLoading(true);

              const data = await Api().user.searchUsers(
                {
                  _query: splitSearchUsers[0],
                },
                pageNumber
              );

              handleSearchedData([...searchedData.concat(data)]);

              handleLoading(false);

              data.length === 9
                ? setLocalPage((localPage) => localPage + 1)
                : setLocalPage(0);
            }
          } else if (type === "posts") {
            handleLoading(true);

            const data = await Api().post.searchPosts(searchQuery, pageNumber);

            handleSearchedData([...searchedData.concat(data)]);

            handleLoading(false);

            data.length === 5
              ? setLocalPage((localPage) => localPage + 1)
              : setLocalPage(0);
          }
        }
      } catch (err) {
        console.warn(err);
      }
    },
    [handleLoading, handleSearchedData, searchQuery, searchedData, type]
  );

  const onClickNextButton = async () => {
    await loadMoreResults(localPage === 0 ? 2 : localPage + 1);

    setIsNextButtonVisible(false);
  };

  React.useEffect(() => {
    setLocalPage(1);
  }, [type]);

  React.useEffect(() => {
    if (type === "users") {
      localPage === 0 && setLocalPage(1);

      searchedData.length === 9 && setIsNextButtonVisible(true);
    } else if (type === "posts" && searchedData.length === 5)
      localPage === 0 && setLocalPage(1);
  }, [searchedData]);

  React.useEffect(() => {
    (async () => {
      try {
        if (type === "posts" && inView && localPage === 1) {
          handleLoading(true);

          await loadMoreResults(2);

          handleLoading(false);
        } else if (
          (type === "users" && inView && localPage !== 1) ||
          (type === "posts" && inView && localPage !== 1)
        ) {
          handleLoading(true);

          await loadMoreResults(localPage + 1);

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
      {type === "users" && searchedData.length !== 0 ? (
        <div
          className={styles.searchedUsersBlock}
          style={{
            gridTemplateColumns: searchedData?.length < 3 && "1fr",
          }}
        >
          {searchedData.map((user) => (
            <UserItem key={user.userId} {...user} menuHidden innerRef={ref} />
          ))}
        </div>
      ) : (
        <ul ref={parent}>
          {searchedData.map((post) => (
            <li key={post.postId}>
              <Post {...post} innerRef={ref} menuHidden />
            </li>
          ))}
        </ul>
      )}
      {type === "users" &&
        isNextButtonVisible &&
        page === 1 &&
        searchedData.length > 0 &&
        !isLoading && (
          <Button onClick={onClickNextButton} variant="outlined">
            Загрузить еще...
          </Button>
        )}
      {isEmptyResults && (
        <NotFoundBlock text="По данному запросу ничего не найдено" />
      )}
    </>
  );
};
