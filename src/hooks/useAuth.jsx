import { useRecoilState } from 'recoil';
import API from '../configs/API';
import server from '../configs/server';
import { authState } from '../stores/auth/atom';
import { getResponseUsable, refresh, REST, tryCatchResponse } from '../utils';

/**
 * @typedef {Object} LoginProps
 * @property {string} email
 * @property {string} password
 */

const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const me = async (isCalledInAuthContext = false) => {
    const res = await refresh(REST.GET, API.USER.me);
    res.status === 200 &&
      isCalledInAuthContext &&
      setAuth((state) => ({ ...state, isSignedIn: true, userData: res.data }));
    return res;
  };

  /**
   *
   * @param {LoginProps} param0
   * @param {boolean} remeberMe
   */
  const login = async ({ email, password }, remeberMe = false) => {
    return await tryCatchResponse(async () => {
      const res = await server.post(API.AUTH.login, { email, password });

      window.localStorage.setItem('accessToken', res.data.access_token);
      if (remeberMe) {
        window.localStorage.setItem('refreshToken', res.data.refresh_token);
      }

      setAuth((state) => ({ ...state, isSignedIn: true }));

      return getResponseUsable(res);
    });
  };

  const logout = () => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    setAuth((state) => ({ ...state, isSignedIn: false, userData: null }));
  };

  /**
   *
   * @param {any} form
   */
  const register = async (form) => {
    // try {
    //   const res = await server.post(API.USER.default, form);
    //   return getResponseUsable(res);
    // } catch (err) {
    //   return getResponseUsable(err.response);
    // }
  };

  return { me, login, logout, register };
};

export default useAuth;
