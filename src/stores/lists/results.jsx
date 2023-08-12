import { atom } from 'recoil';

export const resultState = atom({
  key: 'resultState',
  default: {
    isMedicine: null,
    id: null,
    name: '',
    barcode: '',
    materials: null,
    allergies: null,
    ingredients: null,
    alerts: {
      family: [],
      friend: [],
    },
  },
});
