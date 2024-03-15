import React from 'react';
import { REST, refresh } from '../utils';
import API from '../configs/API';
import { useRecoilState } from 'recoil';
import { guessState } from '../stores/lists/guess';
import axios from 'axios';

const useGuess = () => {
  const [guess, setGuess] = useRecoilState(guessState);

  /** 다음 달 반환 'yyyy-mm' */
  function getNextMonth(year, month) {
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    return `${year}-${String(month).padStart(2, '0')}`;
  }

  const privateGetRecentDate = () => {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const startDate = `${String(d.getFullYear()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    const endDate = getNextMonth(d.getFullYear(), d.getMonth() + 1) + '-01';
    return { startDate, endDate };
  };

  /**
   *
   * @param {number} profileId
   * @param {string=} startDate
   * @param {string=} endDate
   * @returns
   */
  const getFood = async (profileId, startDate, endDate) => {
    // if (!startDate || !endDate) {
    //   const predate = privateGetRecentDate();
    //   startDate = predate.startDate;
    //   endDate = predate.endDate;
    // }
    // const res = await refresh(REST.GET, `${API.GUESS.food}/${profileId}`, { params: { startDate, endDate } });
    // setGuess((v) => ({ ...v, food: res.data }));
    // return res;
  };

  /**
   *
   * @param {number} profileId
   * @param {string=} startDate
   * @param {string=} endDate
   * @returns
   */
  const getMedicine = async (profileId, startDate, endDate) => {
    // if (!startDate || !endDate) {
    //   const predate = privateGetRecentDate();
    //   startDate = predate.startDate;
    //   endDate = predate.endDate;
    // }
    // console.log({ profileId, startDate, endDate });
    // const res = await refresh(REST.GET, `${API.GUESS.medicine}/${profileId}`, { params: { startDate, endDate } });
    // setGuess((v) => ({ ...v, medicine: res.data }));
    // return res;
  };

  return { getFood, getMedicine };
};

export default useGuess;
