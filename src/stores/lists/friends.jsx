import '../../types';
import { atom, RecoilState } from 'recoil';

/**
 * @type {RecoilState<FriendList[]>}
 */
export const friendListState = atom({
  key: 'friendListState',
  default: [
    {
      category: '나',
      items: [
        {
          id: 0,
          profileImage: null,
          name: '나님',
        },
      ],
    },
    {
      category: '까떼고리 0',
      items: [
        {
          id: 1,
          profileImage: null,
          name: '감바스',
        },
        {
          id: 2,
          profileImage: null,
          name: '나일론',
        },
      ],
    },
  ],
});
