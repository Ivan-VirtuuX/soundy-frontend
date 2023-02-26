import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Api } from '../../utils/api';
import { IComment } from '../../utils/api/types';

type UseCommentsProps = {
  setComments: Dispatch<SetStateAction<IComment[]>>;
  comments: IComment[];
};

export const useComments = (postId?: string | string[]): UseCommentsProps => {
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (postId) {
          const arr = await Api().comment.getAll(postId);

          setComments(arr);
        } else {
          const arr = await Api().comment.getAll();

          setComments(arr);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [postId]);

  return { comments, setComments };
};
