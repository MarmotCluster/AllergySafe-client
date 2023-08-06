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

  return { search, scanResult };
};

export default useScan;
