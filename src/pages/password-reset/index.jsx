import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useAuth from '../../hooks/useAuth';
import { globalState } from '../../stores/global/atom';

const PasswordReset = () => {
  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);
  /* hooks */
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { doEmailValidate } = useAuth();

  /* effects */
  useEffect(() => {
    const init = async () => {
      const token = searchParams.get('token');
      if (!token) {
        toast.error('잘못된 접근이에요.');
        navigate('/', { replace: true });
        return;
      }

      try {
        setGlobal((v) => ({ ...v, loading: true }));
        const res = await doEmailValidate(token);
        if (res.status >= 400) {
          toast.error(res.data.message);
          navigate('/', { replace: true });
        } else if (String(res.status)[0] === '2') {
          toast('이메일 인증에 성공했어요. 로그인 해주세요.');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        toast.error('알 수 없는 오류가 발생했어요.');
      } finally {
        setGlobal((v) => ({ ...v, loading: false }));
      }
    };

    init();
  }, []);

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography>잠시만 기다리세요...</Typography>
    </Box>
  );
};

export default PasswordReset;
