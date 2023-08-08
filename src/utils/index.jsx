import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import server from '../configs/server';
import API from '../configs/API';

export const REST = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

interface ResponseUsable {
  status: number | null;
  data: any;
}

export const getResponseUsable = (response: AxiosResponse): ResponseUsable => {
  return {
    status: response.status ? response.status : null,
    data: response.data ? response.data : null,
  };
};

interface YupErrorMessage {
  path: string;
  message: string;
  inner: any[];
}

export const getYupErrorMessages = ({ path, message, inner }: YupErrorMessage) => {
  if (inner && inner.length) {
    return inner.reduce((acc, { path, message }) => {
      acc[path] = message;
      return acc;
    }, {});
  }
  return { [path]: message };
};

/**
 *
 * @param {'get' | 'post' | 'put' | 'delete'} method
 * @param {string} address
 * @param {AxiosRequestConfig<any>=} config
 * @param {any=} data this used in method 'POST' and 'PUT' only.
 * @returns {Promise<ResponseUsable>}
 */
export const refresh = (method, address, config, data) => {
  const fetchData = async (bypass = false) => {
    const storedToken = window.localStorage.getItem('accessToken');
    const refreshToken = window.localStorage.getItem('refreshToken');
    /**@type {AxiosResponse<any, any>} */
    let res;

    if (storedToken) {
      try {
        if (method === REST.GET || method === REST.DELETE) {
          res = await server[method](address, {
            ...config,
            headers: {
              ...config?.headers,
              Authorization: `Bearer ${storedToken}`,
            },
          });
        } else if (method === REST.POST || method === REST.PUT) {
          res = await server[method](
            address,
            { ...data },
            { ...config, headers: { ...config?.headers, Authorization: `Bearer ${storedToken}` } }
          );
        }

        return getResponseUsable(res);
      } catch (err) {
        if (bypass) return { status: 400, data: { message: 'UNKNWON_ERROR' } };

        if (err instanceof AxiosError) {
          if (err.response?.data) {
            const { error_code, message } = err.response.data;
            // ... case if token has expired
            if (err.response.status === 401) {
              if (!refreshToken) return { status: 400, data: { message: 'TOKEN_NOT_FOUND' } };

              try {
                const refreshResult = await server.post(API.AUTH.refresh, { refresh_token: refreshToken });
                const newToken = refreshResult.data.access_token;
                window.localStorage.setItem('accessToken', newToken);
                return fetchData(true);
              } catch (finalError) {
                if (finalError instanceof AxiosError) {
                  return getResponseUsable(finalError.response);
                }
              }
            } else {
              return getResponseUsable(err.response);
            }
          }
        }
      }
      // }
    } else if (refreshToken) {
      try {
        const refreshResult = await server.post(API.AUTH.refresh, { refresh_token: refreshToken });
        const newToken = refreshResult.data.access_token;
        window.localStorage.setItem('accessToken', newToken);
        return fetchData(true);
      } catch (finalError) {
        if (finalError instanceof AxiosError) {
          return getResponseUsable(finalError.response);
        }
      }
    }

    return { status: 400, data: { message: 'NOT_SIGNED_IN' } };
  };

  const result = fetchData();

  return result;
};

/**
 *  use this when request to server using direct server object.
 */
export const tryCatchResponse = (func: () => Promise<ResponseUsable>): Promise<ResponseUsable> => {
  try {
    return new Promise((resolve) => {
      resolve(func());
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      const res = err.response;
      return new Promise((resolve) => resolve(getResponseUsable(res)));
    }
  }
  return new Promise((resolve) => resolve({ status: null, data: null }));
};

export const unescapeHTML = (escapedHTML: string) => {
  return String(escapedHTML)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
};

export const convertDateStringToOurs = (dateString: string) => {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
  const date = d.getDate();

  return { year, month, date };
};

interface CustomDate {
  month: number;
  date: number;
  year: number;
}

export const getDateStringFromOurs = (dateObject: CustomDate) => {
  const raw = dateObject;
  return `${raw.month} ${raw.date}, ${raw.year}`;
};

export const getRandomHexColor = () => {
  return `#${Math.round(Math.random() * 255).toString(16)}${Math.round(Math.random() * 255).toString(16)}${Math.round(
    Math.random() * 255
  ).toString(16)}`;
};

/**
 * Calculates the recommended text color (white or black) for a given background color
 * based on legibility.
 *
 * @param {string | {r:number,g:number,b:number}} backgroundColor - The background color in hexadecimal format (e.g., "#RRGGBB" or "{r:RR,g:GG,b:BB}").
 * @returns {'black' | 'white'} The recommended text color: "white" or "black".
 */
export const getTextColorForBackground = (backgroundColor) => {
  const isString = typeof backgroundColor === 'string';

  // Convert the background color to its RGB components
  const r = isString ? parseInt(backgroundColor.substr(1, 2), 16) : backgroundColor.r;
  const g = isString ? parseInt(backgroundColor.substr(3, 2), 16) : backgroundColor.g;
  const b = isString ? parseInt(backgroundColor.substr(5, 2), 16) : backgroundColor.b;

  // Calculate the luminance of the background color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Determine if white or black text would be more legible
  return luminance > 0.5 ? 'black' : 'white';
};
