import React from 'react';
import { REST, getResponseUsable, refresh, tryCatchResponse } from '../utils';
import API from '../configs/API';
import { useRecoilState } from 'recoil';
import { scanResultState } from '../stores/scan/atom';
import { resultState } from '../stores/lists/results';

const useScan = () => {
  /* stores */
  const [scanResult, setScanResult] = useRecoilState(resultState);

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

    if (String(res.status)[0] !== '2') {
      console.log(res);
      return res;
    }

    const id = res.data.id;

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
   * @param {string} title
   * @param {string} materials
   * @param {string} allergics
   */
  const submitCustomized = async (title, materials, allergics) => {
    let res = await refresh(REST.POST, API.SCAN.post, undefined, { title, materials, allergics });
    res = getResponseUsable(res);
    console.log(res);
    return res;
  };

  return { search, submitCustomized, scanResult };
};

export default useScan;
