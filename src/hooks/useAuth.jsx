import { useRecoilState } from 'recoil';
import API from '../configs/API';
import server from '../configs/server';
import { authState } from '../stores/auth/atom';
import { getResponseUsable, refresh, REST, tryCatchResponse } from '../utils';
import axios from 'axios';
import useList from './useList';
import useGuess from './useGuess';

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
  const { getFood, getMedicine } = useGuess();

  const me = async (isCalledInAuthContext = false) => {
    const res = await refresh(REST.GET, API.USER.me);
    if (res.status === 200 && isCalledInAuthContext) {
      getContacts();
      getAutocompletes();
      getFood(res.data.id);
      getMedicine(res.data.id);
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
        // const token = window.localStorage.getItem('accessToken');
        const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiaXNzIjoiaHR0cHM6Ly9naXRodWIuY29tL2Rldi10YWV3b24ta2ltIiwiZXhwIjoxNzI3NjcxMTM3LCJpYXQiOjE2OTE2NzExMzd9.zYDWwv1Ja5xPO5QuZBcMbOuWly2nU2gLcRSm83lXQPs`;
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

  /**
   *
   * @param {string} token
   * @param {boolean=} passwordReset
   * @param {string=} newPassword
   * @returns
   */
  const doEmailValidate = async (token, passwordReset = false, newPassword) => {
    if (passwordReset) {
      return await tryCatchResponse(async () => {
        try {
          const res = await server.post(API.USER.passwordReset, { token, newPassword });
          return getResponseUsable(res);
        } catch (err) {
          return getResponseUsable(err.response);
        }
      });
    }

    return await tryCatchResponse(async () => {
      try {
        const res = await server.get(API.USER.validate, { params: { token } });
        return getResponseUsable(res);
      } catch (err) {
        return getResponseUsable(err.response);
      }
    });
  };

  const requestReset = async (email) => {
    return await tryCatchResponse(async () => {
      try {
        const res = await server.get(API.USER.passwordReset, { params: { email } });
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

  return { me, login, logout, register, test, doEmailValidate, changePassword, changeProfileImage, requestReset };
};

export default useAuth;
