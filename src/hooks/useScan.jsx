import React from 'react';
import { REST, getResponseUsable, refresh, tryCatchResponse } from '../utils';
import API from '../configs/API';

const useScan = () => {
  /**
   *
   * @param {string} serial
   */
  const search = async (serial) => {
    const res = await refresh(REST.GET, API.SCAN.search, { params: { serial } });
    return getResponseUsable(res);
  };

  return { search };
};

export default useScan;
