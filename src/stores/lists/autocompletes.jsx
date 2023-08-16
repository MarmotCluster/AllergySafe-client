import '../../types';
import { atom, RecoilState } from 'recoil';

/**@type {RecoilState<AutocompleteList>} */
export const autocompleteState = atom({
  key: 'autocompleteState',
  default: {
    materials: [],
    allergies: [],
    ingredients: [],
    foods: [],
    medicines: [],
  },
});
