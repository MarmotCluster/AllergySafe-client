import '../../types';
import { RecoilState, atom } from 'recoil';

/**
 * @typedef {Object} ScanResult
 * @property {string} name
 * @property {string | number} serial
 * @property {string[]} ingredients
 * @property {string[]} antigens
 * @property {FriendList[]} friendList
 */

/**@type {RecoilState<ScanResult | null>} */
export const scanResultState = atom({
  key: 'scanResultState',
  default: {
    name: '펩시 제로 슈가 라임맛',
    serial: '881056175832',
    ingredients: [
      '정제수',
      '이산화탄소',
      '카라멜색소',
      '프로필렌글리콜',
      '구연산',
      '구연산나트륨',
      '인산',
      '아스파탐',
      '아세설팜칼륨',
      '카페인',
      '수크랄로스',
      '합성향료',
      '코코넛오일',
    ],
    antigens: [],
    friendList: [
      {
        category: '가족',
        items: [
          {
            id: 0,
            profileImage: null,
            name: '나님',
          },
        ],
      },
      {
        category: '친구',
        items: [
          {
            id: 1,
            profileImage: null,
            name: '감바스',
            allergics: ['깨'],
          },
          {
            id: 2,
            profileImage: null,
            name: '나일론',
            allergics: ['레몬', '사과산'],
          },
        ],
      },
    ],
  },
});
