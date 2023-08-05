import React from 'react';
import { useRecoilState } from 'recoil';
import { friendListState } from '../stores/lists/friends';
import { REST, refresh, tryCatchResponse } from '../utils';
import API from '../configs/API';

const useList = () => {
  /* stores */
  const [friends, setFriends] = useRecoilState(friendListState);

  /* functions */
  const getFriends = async () => {
    const res = await refresh(REST.GET, API.LIST.friend);
    if (res.data) {
      setFriends([...res.data]);
    }
    return res;
  };
};

export default useList;
