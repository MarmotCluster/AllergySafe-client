import '../../types';
import { atom, RecoilState } from 'recoil';

/**
 * @type {RecoilState<Contacts>}
 */
export const friendListState = atom({
  key: 'friendListState',
  default: {
    family: [],
    friend: [],
  },
});
