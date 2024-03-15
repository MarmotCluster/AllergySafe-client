import React from 'react';
import { REST, isSuccess, refresh } from '../utils';
import API from '../configs/API';

const useDiary = () => {
  /**
   *
   * @param {number} profileId
   * @param {string} startDate
   * @param {string} endDate
   */
  const getDiary = async (profileId, startDate, endDate) => {
    const res = await refresh(REST.GET, API.DIARY.period, { params: { profileId, startDate, endDate } });
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
  const createNewDiary = async (profileId, date) => {
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

  /**
   *
   * @param {number} profileId
   * @param {'food' | 'medicine' | 'symptom'} diaryElementType
   * @param {number} itemId
   * @param {string=} dateTime yyyy-mm-dd
   */
  const writeNewDiary = async (profileId, diaryElementType, itemId, dateTime = undefined, base64String = null) => {
    const date = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const today = dateTime ? dateTime.split('T')[0] : date.toISOString().split('T')[0];

    // ... 금일 일기가 있는지 먼저 확인
    let diaryId = null;
    let diaryToday = await getDiaryByDate(profileId, today);
    if (isSuccess(diaryToday.status)) {
      diaryId = diaryToday.data.id;
    } else if (diaryToday.status >= 400) {
      // ... 없으면 생성 후에
      const created = await createNewDiary(profileId, today);
      if (created.status >= 400) {
        return created;
      }

      diaryId = created.data.id;
    }

    // ... 일기쓰기
    const res = await postElementIntoDiary(diaryId, {
      diaryElementType,
      id: itemId,
      // dateTime: date.toISOString().split('T')[0] + 'T00:00:01.000Z',
      dateTime: dateTime ? dateTime : date.toISOString(),
      base64String,
    });
    return res;
  };

  return {
    getDiary,
    getDiaryByDate,
    createNewDiary,
    deleteDiaryById,
    postElementIntoDiary,
    deleteElementFromDiary,
    writeNewDiary,
  };
};

export default useDiary;
