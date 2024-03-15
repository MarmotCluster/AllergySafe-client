import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useAuth from '../../hooks/useAuth';
import { ACCESS_DENY_ON_SIGNED_IN, ACCESS_DENY_ON_SIGNED_OUT } from '../../router/navigation';
import { authState } from '../../stores/auth/atom';

const AuthContext = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { me, logout, test } = useAuth();

  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('accessToken');
    let current = location.pathname;

    if (current[current.length - 1] === '/') {
      current = location.pathname !== '/' ? current.slice(0, current.length - 1) : current;
      console.log(current);
    }

    if (storedToken) {
      if (ACCESS_DENY_ON_SIGNED_IN.includes(current)) {
        navigate('/');
      }
    } else {
      if (ACCESS_DENY_ON_SIGNED_OUT.includes(current)) {
        navigate('/login');
      }
    }
  }, [location]);

  useEffect(() => {
    const init = async () => {
      const res = await me(true);

      if (!res || res.status >= 400) {
        logout();
      } else if (res.status === 200) {
        setAuth((v) => ({ ...v, isSignedIn: true }));
      }
    };

    init();
  }, [auth.isSignedIn]);

  return null;
};

export default AuthContext;
