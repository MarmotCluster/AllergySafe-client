import { RecoilState, atom } from 'recoil';

/**
 * @typedef {Object} ScanResult
 * @property {string} name
 * @property {string | number} serial
 * @property {string[]} ingredients
 * @property {string[]=} antigens
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
  },
});
