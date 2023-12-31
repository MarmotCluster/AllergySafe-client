import '../../types';
import { atom, RecoilState } from 'recoil';

/**
 * Represents a profile with associated data.
 * @typedef {Object} GuessData
 * @property {number} profileId - The ID of the profile.
 * @property {string} name - The name of the profile.
 * @property {string} startDate - The start date of the profile.
 * @property {string} endDate - The end date of the profile.
 * @property {Array<GuessedData>} guessedData - An array of guessed data entries.
 */

/**
 * Represents guessed data associated with a profile.
 * @typedef {Object} GuessedData
 * @property {string} type - The type of guessed data (e.g., 'ingredient').
 * @property {number} elementId - The ID of the guessed data element.
 * @property {string|null} imageUrl - The URL of the guessed data image.
 * @property {string} name - The name of the guessed data.
 * @property {number} totalCount - The total count of the guessed data.
 * @property {number} totalSymptomOccuredCount - The total count of symptom occurrences.
 * @property {number} percentage - The percentage value.
 * @property {Array<Card>} cards - An array of associated card entries.
 */

/**
 * Represents a card associated with guessed data.
 * @typedef {Object} Card
 * @property {string} type - The type of the card (e.g., 'medicine').
 * @property {number} elementId - The ID of the card element.
 * @property {string} name - The name of the card.
 * @property {string} dateTime - The date and time of the card entry.
 * @property {Array<Symptom>} symptoms - An array of associated symptoms.
 */

/**
 * Represents a symptom associated with a card.
 * @typedef {Object} Symptom
 * @property {number} id - The ID of the symptom.
 * @property {string} name - The name of the symptom.
 * @property {string|null} imageUrl - The URL of the symptom image.
 */

/**
 * @type {RecoilState<{food:GuessData, medicine:GuessData}>}
 */
export const guessState = atom({
  key: 'guessState',
  default: {
    food: {
      profileId: 1,
      name: '홍길동',
      startDate: '2023-06-01',
      endDate: '2023-06-30',
      guessedData: [
        {
          type: 'allergy',
          elementId: 5,
          imageUrl: 'https://s5.allergysafe.life/files/ebda141a8c994235b051f424b47137e9.jpg',
          name: '대두',
          totalCount: 9,
          totalSymptomOccuredCount: 8,
          percentage: 89,
          cards: [
            {
              type: 'food',
              elementId: 34,
              name: '맛살하면 역시 오양맛살',
              dateTime: '2023-06-30T13:00:13.367',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
            {
              type: 'food',
              elementId: 36,
              name: '우유튀김',
              dateTime: '2023-06-28T17:30:13.367',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
              ],
            },
            {
              type: 'food',
              elementId: 41,
              name: 'ONLY price 간장치킨맛 팝콘',
              dateTime: '2023-06-26T14:30:45.518',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
          ],
        },
        {
          type: 'allergy',
          elementId: 3,
          imageUrl: 'https://s5.allergysafe.life/files/bf55b7a553614d41ada528dc68772bb9.jpg',
          name: '깨',
          totalCount: 9,
          totalSymptomOccuredCount: 5,
          percentage: 67,
          cards: [
            {
              type: 'food',
              elementId: 31,
              name: '목사골一品홍어',
              dateTime: '2023-06-26T14:30:45.518',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
            {
              type: 'food',
              elementId: 4,
              name: '순창궁발아콩12가지양념쌈장',
              dateTime: '2023-06-18T13:30:13.367',
              symptoms: [
                {
                  id: 1,
                  name: '기침',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
            {
              type: 'food',
              elementId: 31,
              name: '목사골一品홍어',
              dateTime: '2023-06-13T14:00:45.518',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
                {
                  id: 4,
                  name: '구토',
                },
              ],
            },
          ],
        },
        {
          type: 'material',
          elementId: 177,
          imageUrl: 'https://s5.allergysafe.life/files/a52e895ae7fd47b589360027a359fc4c.jpg',
          name: '감자전분',
          totalCount: 12,
          totalSymptomOccuredCount: 3,
          percentage: 25,
          cards: [
            {
              type: 'food',
              elementId: 33,
              name: '김밥 愛(애) 쏘옥',
              dateTime: '2023-06-24T18:00:13.367',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
              ],
            },
            {
              type: 'food',
              elementId: 33,
              name: '김밥 愛(애) 쏘옥',
              dateTime: '2023-06-22T19:00:13.367',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
              ],
            },
            {
              type: 'food',
              elementId: 33,
              name: '김밥 愛(애) 쏘옥',
              dateTime: '2023-06-16T08:00:13.367',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
          ],
        },
        {
          type: 'allergy',
          elementId: 11,
          imageUrl: 'https://s5.allergysafe.life/files/c7abe8eb90374315adf489dc122f0071.jpg',
          name: '복숭아',
          totalCount: 16,
          totalSymptomOccuredCount: 3,
          percentage: 19,
          cards: [
            {
              type: 'food',
              elementId: 35,
              name: '뽕따 레드피치',
              dateTime: '2023-06-30T13:00:13.367',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
            {
              type: 'food',
              elementId: 35,
              name: '뽕따 레드피치',
              dateTime: '2023-06-28T17:30:13.367',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
              ],
            },
            {
              type: 'food',
              elementId: 35,
              name: '뽕따 레드피치',
              dateTime: '2023-06-26T14:30:45.518',
              symptoms: [
                {
                  id: 3,
                  name: '설사',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
          ],
        },
      ],
    },
    medicine: {
      profileId: 1,
      name: '홍길동',
      startDate: '2023-07-01',
      endDate: '2023-07-31',
      guessedData: [
        {
          type: 'ingredient',
          elementId: 31,
          imageUrl: 'https://s5.allergysafe.life/files/12f0d294bd084c72a0fb7af7de5fee49.jpg',
          name: '스테아르산마그네슘',
          totalCount: 11,
          totalSymptomOccuredCount: 10,
          percentage: 91,
          cards: [
            {
              type: 'medicine',
              elementId: 15,
              name: '아로나민골드정',
              dateTime: '2023-07-31T15:44:01.289',
              symptoms: [
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 40,
              name: '게루삼정',
              dateTime: '2023-07-31T15:44:01.289',
              symptoms: [
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 15,
              name: '아로나민골드정',
              dateTime: '2023-07-30T11:20:01.289',
              symptoms: [
                {
                  id: 2,
                  name: '호흡곤란',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
          ],
        },
        {
          type: 'ingredient',
          elementId: 85,
          imageUrl: 'https://s5.allergysafe.life/files/12f0d294bd084c72a0fb7af7de5fee49.jpg',
          name: '염화나트륨',
          totalCount: 12,
          totalSymptomOccuredCount: 7,
          percentage: 58,
          cards: [
            {
              type: 'medicine',
              elementId: 39,
              name: '라식스주사(푸로세미드)',
              dateTime: '2023-07-31T15:44:01.289',
              symptoms: [
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 39,
              name: '라식스주사(푸로세미드)',
              dateTime: '2023-07-30T11:20:01.289',
              symptoms: [
                {
                  id: 2,
                  name: '호흡곤란',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 39,
              name: '라식스주사(푸로세미드)',
              dateTime: '2023-07-28T12:30:01.289',
              symptoms: [
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
          ],
        },
        {
          type: 'ingredient',
          elementId: 119,
          imageUrl: 'https://s5.allergysafe.life/files/12f0d294bd084c72a0fb7af7de5fee49.jpg',
          name: '포도당',
          totalCount: 13,
          totalSymptomOccuredCount: 3,
          percentage: 23,
          cards: [
            {
              type: 'medicine',
              elementId: 36,
              name: '제일포도당주사액',
              dateTime: '2023-07-30T11:20:01.289',
              symptoms: [
                {
                  id: 2,
                  name: '호흡곤란',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 36,
              name: '제일포도당주사액',
              dateTime: '2023-07-28T12:30:01.289',
              symptoms: [
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 36,
              name: '제일포도당주사액',
              dateTime: '2023-07-27T12:00:01.289',
              symptoms: [
                {
                  id: 2,
                  name: '호흡곤란',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
              ],
            },
          ],
        },
        {
          type: 'ingredient',
          elementId: 62,
          imageUrl: 'https://s5.allergysafe.life/files/12f0d294bd084c72a0fb7af7de5fee49.jpg',
          name: '시트르산나트륨수화물',
          totalCount: 16,
          totalSymptomOccuredCount: 3,
          percentage: 19,
          cards: [
            {
              type: 'medicine',
              elementId: 14,
              name: '판콜에이내복액',
              dateTime: '2023-07-22T18:30:01.289',
              symptoms: [
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 14,
              name: '판콜에이내복액',
              dateTime: '2023-07-21T12:30:01.289',
              symptoms: [
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
            {
              type: 'medicine',
              elementId: 14,
              name: '판콜에이내복액',
              dateTime: '2023-07-20T11:30:01.289',
              symptoms: [
                {
                  id: 2,
                  name: '호흡곤란',
                },
                {
                  id: 5,
                  name: '두드러기',
                },
                {
                  id: 9,
                  name: '가슴의 압박감',
                },
              ],
            },
          ],
        },
      ],
    },
  },
});
