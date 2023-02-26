import { ResponseUser } from '../../utils/api/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Api } from '../../utils/api';

export const useUser = (userId: string | string[]) => {
  const [user, setUser] = useState<ResponseUser>();

  useEffect(() => {
    (async () => {
      try {
        const arr = await Api().user.getOne(userId);
        setUser(arr);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [userId]);

  return { user, setUser };
};
