const API = {
  baseURL: `https://allergysafe.life/api`,
  ALERT: {
    /** POST */
    food: `/alert/food`,
    /** POST */
    medicine: `/alert/medicine`,
  },
  ALLERGY: {
    /** GET */
    allergy: `/allergy`,
  },
  FOOD: {
    /** POST, GET/{foodId} */
    food: `/food`,
  },
  HEALTH: {
    /** GET */
    health: `/health`,
  },
  INGREDIENT: {
    /** GET */
    ingredient: `/ingredient`,
  },
  AUTH: {
    /** POST */
    login: `/auth/login`,
  },
  MATERIAL: {
    /** GET */
    material: `/material`,
  },
  MEDICINE: {
    /** GET/{medicineId} */
    medicine: `/medicine`,
  },
  SCANNER: {
    /** GET */
    food: `/scanner/food`,
    /** GET */
    medicine: `/scanner/medicine`,
  },
  USER: {
    /** PUT, POST */
    user: `/user`,
    /** POST, DELETE/{profileId} */
    friend: `/user/friend`,
    /** GET */
    me: `/user/me`,
    /** POST/{profileId}, DELETE/{profileId} */
    element: `/user/profile/element`,
    /** POST, DELETE/{profileId} */
    family: `/user/profile/family`,
    /** GET */
    profileMe: `/user/profile/me`,
    /** GET/{profileId} */
    profileShare: `/user/profile/share`,
    /** GET */
    validate: `/user/validate`,
    /** POST */
    profileElement: `/user/profile/element`,
  },
};

export default API;
