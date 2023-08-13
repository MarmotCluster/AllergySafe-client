import React from 'react';
import { REST, refresh } from '../utils';
import API from '../configs/API';

const useDiary = () => {
  /**
   *
   * @param {number} profileId
   * @param {string} startDate
   * @param {string} endDate
   */
  const getDiary = async (profileId, startDate, endDate) => {
    const res = await refresh(REST.GET, API.DIARY.period, undefined, { profileId, startDate, endDate });
    return res;
  };

  /**
   *
   * @param {number} profileId
   * @param {string} date
   */
  const getDiaryByDate = async (profileId, date) => {
    const res = await refresh(REST.GET, `${API.DIARY.deafault}/${profileId}`, { params: { date } });
    return res;
  };

  /**
   *
   * @param {number} profileId
   * @param {string} date
   */
  const postDiaryByDate = async (profileId, date) => {
    const res = await refresh(REST.POST, `${API.DIARY.deafault}/${profileId}`, undefined, { date });
    return res;
  };

  /**
   *
   * @param {number} diaryId
   */
  const deleteDiaryById = async (diaryId) => {
    const res = await refresh(REST.DELETE, `${API.DIARY.deafault}/${diaryId}`);
    return res;
  };

  /**
   *
   * @param {number} diaryId
   * @param {{diaryElementType: string, id: number, dateTime: string}} req
   */
  const postElementIntoDiary = async (diaryId, req) => {
    const res = await refresh(REST.POST, `${API.DIARY.element}/${diaryId}`, undefined, { ...req });
    return res;
  };

  /**
   *
   * @param {number} diaryId
   * @param {{diaryElementType: string, id: number}} req
   */
  const deleteElementFromDiary = async (diaryId, req) => {
    const res = await refresh(REST.DELETE, `${API.DIARY.element}/${diaryId}`, undefined, { ...req });
    return res;
  };

  return { getDiary, getDiaryByDate, postDiaryByDate, deleteDiaryById, postElementIntoDiary, deleteElementFromDiary };
};

export default useDiary;
