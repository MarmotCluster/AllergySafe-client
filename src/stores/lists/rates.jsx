import { atom } from 'recoil';

export const rateState = atom({
  key: 'rateState',
  default: {
    // star: 3,
    // content: 'i reviewed already.',
    // totalCount: 2,
    // average: 3.44,
    // reviews: [
    //   {
    //     date: '2023-08-08',
    //     star: 5,
    //     content: '정확도가 높아요',
    //   },
    //   {
    //     date: '2023-08-08',
    //     star: 1,
    //     content: '생각만큼 원하는 결과가 나오지 않아요.',
    //   },
    // ],
    star: -1,
    content: '',
    totalCount: -1,
    average: -1,
    reviews: [],
  },
});
