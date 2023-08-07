const API = {
  AUTH: {
    login: `/loginapi`,
    refresh: `/refreshapi`,
  },
  USER: {
    me: `/get-me`,
  },
  SCAN: {
    search: `/search`,
    post: `/selfpost`,
  },
  LIST: {
    friend: `/list/friends`,
  },
};

export default API;
