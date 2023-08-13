import { useRecoilState } from 'recoil';
import API from '../configs/API';
import server from '../configs/server';
import { authState } from '../stores/auth/atom';
import { getResponseUsable, refresh, REST, tryCatchResponse } from '../utils';
import axios from 'axios';
import useList from './useList';

/**
 * @typedef {Object} LoginProps
 * @property {string} email
 * @property {string} password
 */

const useAuth = () => {
  /* stores */
  const [auth, setAuth] = useRecoilState(authState);

  /* hooks */
  const { getContacts, getAutocompletes } = useList();

  const me = async (isCalledInAuthContext = false) => {
    const res = await refresh(REST.GET, API.USER.me);
    if (res.status === 200 && isCalledInAuthContext) {
      getContacts();
      getAutocompletes();
      setAuth((state) => ({ ...state, isSignedIn: true, userData: res.data }));
    }
    return res;
  };

  /**
   *
   * @param {LoginProps} param0
   * @param {boolean} remeberMe
   */
  const login = async ({ email, password }, remeberMe = false) => {
    return await tryCatchResponse(async () => {
      try {
        const res = await server.post(API.AUTH.login, { email, password });
        window.localStorage.setItem('accessToken', res.data.token);
        // if (remeberMe) {
        //   window.localStorage.setItem('refreshToken', res.data.refresh_token);
        // }
        setAuth((state) => ({ ...state, isSignedIn: true }));
        return getResponseUsable(res);
      } catch (err) {
        return getResponseUsable(err.response);
      }
    });
  };

  const logout = () => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    setAuth((state) => ({ ...state, isSignedIn: false, userData: null }));
  };

  /**
   *
   * @param {{
   *  name: string,
   *  email: string,
   *  password: string,
   * }} form
   */
  const register = async (form) => {
    return await tryCatchResponse(async () => {
      try {
        const res = await server.post(API.USER.user, { ...form });
        return getResponseUsable(res);
      } catch (err) {
        return getResponseUsable(err.response);
      }
    });
  };

  /**
   *
   * @param {{
   *  currentPassword: string,
   *  newPassword: string,
   * }} form
   * @returns
   */
  const changePassword = async (form) => {
    const res = await refresh(REST.PUT, API.USER.user, undefined, form);
    return res;
  };

  /**
   *
   * @param {number} profileId
   * @param {FormData} formData
   * @returns
   */
  const changeProfileImage = async (profileId, formData) => {
    return await tryCatchResponse(async () => {
      try {
        const token = window.localStorage.getItem('accessToken');
        let res = await axios.post(`https://r2.allergysafe.life/image.png`, formData, {
          headers: { 'Content-Type': 'image/png' },
          params: { token, mimeType: 'image/png' },
        });
        res = getResponseUsable(res);

        if (res.status >= 400) {
          return res;
        }

        const urlFixed = res.data.url.replace('.undefined', '.png');
        res = await refresh(REST.POST, `${API.USER.profileImage}/${profileId}`, undefined, { imageUrl: urlFixed });
        return res;
      } catch (err) {
        return getResponseUsable(err.response);
      }
    });
  };

  const doEmailValidate = async (token) => {
    return await tryCatchResponse(async () => {
      try {
        const res = await server.get(API.USER.validate, { params: { token } });
        return getResponseUsable(res);
      } catch (err) {
        return getResponseUsable(err.response);
      }
    });
  };

  const test = async () => {
    // const res = await server.get(API.HEALTH.health);
    // console.log(res);
  };

  return { me, login, logout, register, test, doEmailValidate, changePassword, changeProfileImage };
};

export default useAuth;
