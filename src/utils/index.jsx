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
            data,
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

/**
 *
 * @param {number} responseStatus
 */
export const isSuccess = (responseStatus) => {
  return String(responseStatus)[0] === '2';
};

/**
 *
 * @param {number} responseStatus
 */
export const isFailed = (responseStatus) => {
  return responseStatus >= 400;
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

export const DateHandler = {
  /** 대한민국 시간 반환 */
  getDate: () => {
    return new Date(Date.now() + 9 * 60 * 60 * 1000);
  },

  /** 시간은 제거 */
  getYYYYMMDD: (str) => {
    return str.split('T')[0];
  },

  /** 그 月의 1일날 요일 반환 */
  getFirstDayOfWeek: (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  },

  /** 그 月의 날 수 반환 (28~31(일)) */
  getDaysInMonth: (year, month) => {
    return new Date(year, month, 0).getDate();
  },

  /** 지난 달 반환 'yyyy-mm' */
  getLastMonth: (year, month) => {
    if (month === 0) {
      year--;
      month = 12;
    }
    return `${year}-${String(month).padStart(2, '0')}`;
  },

  /** 다음 달 반환 'yyyy-mm' */
  getNextMonth: (year, month) => {
    if (month === 12) {
      year++;
      month = 1;
    } else {
      month++;
    }
    return `${year}-${String(month).padStart(2, '0')}`;
  },

  /** 입력받은 날짜 문자열로 반환 'yyyy-mm-dd' */
  formatDate: (year, month, day) => {
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  },

  /** 오늘인지 반환 */
  isCurrentDate: (dateString) => {
    const currentDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const inputDate = new Date(dateString);

    return (
      currentDate.getFullYear() === inputDate.getFullYear() &&
      currentDate.getMonth() === inputDate.getMonth() &&
      currentDate.getUTCDate() === inputDate.getDate()
    );
  },

  /** 전달 다음달 고쳐진 값 반환 */
  fixMonth: (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);

    let newYear = year;
    let newMonth = month + 1;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }

    const newDateString = `${newYear}-${String(newMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return newDateString;
  },

  /** 미래여부 반환 */
  isFutureDate: (yearMonthValue) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const inputYear = Math.floor(yearMonthValue / 12);
    const inputMonth = yearMonthValue % 12;

    if (inputYear > currentYear) {
      return true;
    } else if (inputYear === currentYear && inputMonth > currentMonth) {
      return true;
    }

    return false;
  },

  /** 더 미래의 날짜 반환 */
  getLaterDate: (dateString1, dateString2) => {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    if (date1 > date2) {
      return dateString1;
    } else {
      return dateString2;
    }
  },
};
