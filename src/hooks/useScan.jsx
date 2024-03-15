import React from 'react';
import { REST, getResponseUsable, isSuccess, refresh, tryCatchResponse } from '../utils';
import API from '../configs/API';
import { useRecoilState } from 'recoil';
import { scanResultState } from '../stores/scan/atom';
import { resultState } from '../stores/lists/results';

const useScan = () => {
  /* stores */
  const [scanResult, setScanResult] = useRecoilState(resultState);

  /**
   *
   * @param {number} id
   * @param {boolean} isMedicine
   * @param {number[]} profileList
   * @returns {Promise<typeof resultState>}
   */
  const searchById = async (id, isMedicine, profileIdList) => {
    const seongboons = isMedicine
      ? await refresh(REST.GET, `${API.MEDICINE.medicine}/${id}`)
      : await refresh(REST.GET, `${API.FOOD.food}/${id}`);

    const alerts = isMedicine
      ? await refresh(REST.POST, API.ALERT.medicine, undefined, { id, profileIdList })
      : await refresh(REST.POST, API.ALERT.food, undefined, { id, profileIdList });
    // console.log({ 성분: seongboons, 경고: alerts });

    /** @type {typeof resultState} */
    const final = {
      isMedicine,
      id: seongboons.data.id,
      name: seongboons.data.name,
      barcode: seongboons.data.barcode,
      materials: seongboons.data.materials ? seongboons.data.materials : null,
      allergies: seongboons.data.allergies ? seongboons.data.allergies : null,
      ingredients: seongboons.data.ingredients ? seongboons.data.ingredients : null,
      alerts: {
        ...alerts.data,
      },
    };

    setScanResult({ ...final });
    return { status: 200, data: final };
  };

  /**
   *
   * @param {string} serial
   * @param {boolean} isMedicine
   * @param {number[]} profileList
   */
  const search = async (serial, isMedicine, profileIdList) => {
    let res;
    res = isMedicine
      ? await refresh(REST.GET, API.SCANNER.medicine, { params: { barcode: serial } })
      : await refresh(REST.GET, API.SCANNER.food, { params: { barcode: serial } });
    res = getResponseUsable(res);

    // ... db에서 없다고 신호보내면 직접 등록으로
    if (!isSuccess(res.status)) {
      return res;
    }

    const id = res.data.id;
    return await searchById(id, isMedicine, profileIdList);
  };

  /**
   *
   * @param {string} title
   * @param {string} materials
   * @param {string} allergics
   * @param {number[]} profileList
   */
  const submitCustomized = async (name, materials, allergies, profileIdList) => {
    let res = await refresh(REST.POST, API.FOOD.food, undefined, { name, materials, allergies });
    res = getResponseUsable(res);
    if (isSuccess(res.status)) {
      console.log(res);
      return res;
    }

    const id = res.data.id;
    return await searchById(id, false, profileIdList);
  };

  return { search, submitCustomized, scanResult };
};

export default useScan;
