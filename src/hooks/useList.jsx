import React from 'react';
import { useRecoilState } from 'recoil';
import { friendListState } from '../stores/lists/friends';
import { autocompleteState } from '../stores/lists/autocompletes';
import { REST, refresh, tryCatchResponse } from '../utils';
import API from '../configs/API';
import { authState } from '../stores/auth/atom';
import { rateState } from '../stores/lists/rates';

const useList = () => {
  /* stores */
  const [auth, setAuth] = useRecoilState(authState);

  const [friends, setFriends] = useRecoilState(friendListState);

  const [options, setOptions] = useRecoilState(autocompleteState);

  const [rates, setRates] = useRecoilState(rateState);

  /* functions */
  const getContacts = async () => {
    const res = await refresh(REST.GET, API.USER.profileMe);
    if (res.status === 200) {
      setAuth((v) => ({ ...v, userData: { ...v.userData, imageUrl: res.data.family[0].imageUrl } }));
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
  const addFriend = async (profileId) => {
    const res = await refresh(REST.POST, API.USER.friend, undefined, { profileId });
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

  const getAutocompletes = async () => {
    const materials = refresh(REST.GET, API.MATERIAL.material);
    const allergies = refresh(REST.GET, API.ALLERGY.allergy);
    const ingredients = refresh(REST.GET, API.INGREDIENT.ingredient);
    const foods = refresh(REST.GET, API.FOOD.food);
    const medicines = refresh(REST.GET, API.MEDICINE.medicine);

    const proms = await Promise.all([materials, allergies, ingredients, foods, medicines]);

    const res = {
      materials: proms[0].data.map(({ id, name }) => ({ label: name, id })),
      allergies: proms[1].data.map(({ id, name }) => ({ label: name, id })),
      ingredients: proms[2].data.map(({ id, name }) => ({ label: name, id })),
      foods: proms[3].data.map(({ id, name }) => ({ label: name, id })),
      medicines: proms[4].data.map(({ id, name }) => ({ label: name, id })),
    };

    setOptions({ ...res });
    return res;
  };

  /**
   *
   * @param {number} profileId
   * @param {'allergy' | 'material' | 'ingredient'} where
   * @param {{profileElementType: 'allergy' | 'material' | 'ingredient', id: number}} req
   */
  const postElement = (profileId, where, req) => {
    const res = refresh(REST.POST, `${API.USER.profileElement}/${profileId}`, undefined, req);
    return res;
  };

  /**
   *
   * @param {number} profileId
   * @param {'allergy' | 'material' | 'ingredient'} where
   * @param {{profileElementType: 'allergy' | 'material' | 'ingredient', id: number}} req
   */
  const removeElement = (profileId, where, req) => {
    const res = refresh(REST.DELETE, `${API.USER.profileElement}/${profileId}`, undefined, req);
    return res;
  };

  const getRate = async () => {
    const res = await refresh(REST.GET, `${API.RATE.rate}`);
    if (String(res.status)[0] === '2') {
      setRates({ ...res.data });
    }
    return res;
  };

  /**
   *
   * @param {number} rate
   * @param {string} content
   * @returns
   */
  const postReview = async (star, content) => {
    const res = await refresh(REST.POST, `${API.RATE.rate}`, undefined, { star, content });
    return res;
  };

  return {
    getContacts,
    addFamily,
    deleteFromFamily,
    addFriend,
    deleteFromFriend,
    getAutocompletes,
    postElement,
    removeElement,
    getRate,
    postReview,
  };
};

export default useList;
