import React from 'react';
import Login from '../pages/login';
import Scan from '../pages/scan';

/** contain paths that should not direct on logged in */
export const ACCESS_DENY_ON_SIGNED_IN = ['/login', , '/register'];
/** contain paths that should not direct on logged OUT */
export const ACCESS_DENY_ON_SIGNED_OUT = ['/articles/create', '/users/me' /*, '/scan'*/];

export interface Navigation {
  path: string;
  element: JSX.Element;
}

const navigation: Navigation[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/scan',
    element: <Scan />,
  },
];

export default navigation;
