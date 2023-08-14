import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import useAuth from '../../hooks/useAuth';
import { globalState } from '../../stores/global/atom';

const PasswordReset = () => {
  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);

  /* states */
  const [form, setForm] = useState({
    password: '',
    confirm: '',
  });

  const [error, setError] = useState({
    password: false,
    confirm: false,
  });

  /* hooks */
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { doEmailValidate } = useAuth();

  /* functions */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = searchParams.get('token');
    let hasError = { password: false, confirm: false };
    if (!form.password || !/^(?=.*[a-zA-Z])(?=.*[~!@#^*?])(?=.*[0-9]).{8,20}$/.test(form.password)) {
      hasError.password = true;
    }

    if (!form.confirm || form.confirm !== form.password) {
      hasError.confirm = true;
    }

    setError({ ...hasError });

    if (!Object.values(hasError).every((i) => !i)) return;

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await doEmailValidate(token, true, form.password);
      if (res.status >= 400) {
        toast.error(res.data.message);
        navigate('/', { replace: true });
      } else if (String(res.status)[0] === '2') {
        toast('변경되었어요. 로그인 해주세요.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      toast.error('알 수 없는 오류가 발생했어요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  /* effects */
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast.error('잘못된 접근이에요');
      navigate('/', { replace: true });
    }
  }, []);

  /* renders */
  return (
    <Box
      sx={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}
    >
      <form action="#" onSubmit={handleSubmit}>
        <Typography variant="body1" display="block" textAlign="center" mb={2}>
          새 <b>비밀번호</b>를 입력하세요.
        </Typography>
        <TextField
          fullWidth
          type="password"
          label="새 비밀번호"
          placeholder="password"
          sx={{ mb: 2 }}
          onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
          value={form.password}
          error={error.password}
          helperText={`8~20자 이내의 영문 대소문자,숫자 그리고 다음 특수문자를 포함하여 입력하세요: ~ ! @ # ^ * ?`}
        />
        <TextField
          fullWidth
          type="password"
          label="새 비밀번호 확인"
          placeholder="password"
          sx={{ mb: 2 }}
          onChange={(e) => setForm((v) => ({ ...v, confirm: e.target.value }))}
          value={form.confirm}
          error={error.confirm}
          helperText={error.confirm && `입력란이 비었거나 새 비밀번호와 일치하지 않아요.`}
        />
        <Button type="submit" fullWidth variant="contained" size="large">
          변경하기
        </Button>
      </form>
    </Box>
  );
};

export default PasswordReset;
