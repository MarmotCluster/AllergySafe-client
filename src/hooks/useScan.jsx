import React from 'react';
import { REST, getResponseUsable, refresh, tryCatchResponse } from '../utils';
import API from '../configs/API';
import { useRecoilState } from 'recoil';
import { scanResultState } from '../stores/scan/atom';

const useScan = () => {
  /* stores */
  const [scanResult, setScanResult] = useRecoilState(scanResultState);

  /**
   *
   * @param {string} serial
   */
  const search = async (serial) => {
    const res = await refresh(REST.GET, API.SCAN.search, { params: { serial } });
    if (res.data) {
      setScanResult({ ...res.data });
    }
    return getResponseUsable(res);
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
