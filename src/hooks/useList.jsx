import React from 'react';
import { useRecoilState } from 'recoil';
import { friendListState } from '../stores/lists/friends';
import { REST, refresh, tryCatchResponse } from '../utils';
import API from '../configs/API';

const useList = () => {
  /* stores */
  const [friends, setFriends] = useRecoilState(friendListState);

  /* functions */
  const getContacts = async () => {
    const res = await refresh(REST.GET, API.USER.profileMe);
    if (res.status === 200) {
      setFriends({ ...res.data });
    }
    return res;
  };

  /**
   *
   * @param {string} name
   * @returns
   */
  const addFamily = async (name) => {
    const res = await refresh(REST.POST, API.USER.family, undefined, { name });
    return res;
  };

  /**
   *
   * @param {number} profileId
   */
  const deleteFromFamily = async (profileId) => {
    const res = await refresh(REST.DELETE, `${API.USER.family}/${profileId}`);
    return res;
  };

  /**
   *
   * @param {number} userId
   */
  const addFriend = async (userId) => {
    const res = await refresh(REST.POST, API.USER.friend, undefined, { userId });
    return res;
  };

  /**
   *
   * @param {number} profileId
   */
  const deleteFromFriend = async (profileId) => {
    const res = await refresh(REST.DELETE, `${API.USER.friend}/${profileId}`);
    return res;
  };

  return { getContacts, addFamily, deleteFromFamily, addFriend, deleteFromFriend };
};

export default useList;
