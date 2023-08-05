import React from 'react';
import Scan from '../pages/scan';
import Login from '../pages/login';
import Register from '../pages/register';
import Diary from '../pages/diary';

/** contain paths that should not direct on logged in */
export const ACCESS_DENY_ON_SIGNED_IN = ['/login', , '/register'];
/** contain paths that should not direct on logged OUT */
export const ACCESS_DENY_ON_SIGNED_OUT = ['/articles/create', '/users/me' /*, '/scan'*/];

/**
 * @typedef {Object} Navigation
 * @property {string} path
 * @property {JSX.Element} element
 */

/**
 * @type {Navigation[]}
 */
const navigation = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/scan',
    element: <Scan />,
  },
  {
    path: '/diary',
    element: <Diary />,
  },
];

export default navigation;
