import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useRecoilState } from 'recoil';
import { globalState } from '../../stores/global/atom';
import { toast } from 'react-hot-toast';

const Login = () => {
  /* hooks */
  const { login, register } = useAuth();

  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);

  /* states */
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorId, setErrorId] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  /* functions */

  /**
   *
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    let hasError = false;
    e.preventDefault();
    console.log({ id, password });

    if (!id) {
      hasError = true;
      setErrorId(true);
    }
    if (!password || !/^(?=.*[a-zA-Z])(?=.*[~!@#^*?])(?=.*[0-9]).{8,20}$/.test(password)) {
      hasError = true;
      setErrorPassword(true);
    }

    if (hasError) return;

    setErrorId(false);
    setErrorPassword(false);

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const result = await login({ email: id, password });
    } catch (err) {
      toast.error('나중에 다시 시도해 주세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  return (
    <Container
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 74px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Typography variant="body1" display="block" textAlign="center" mb={2}>
          <b>이메일</b>과 <b>비밀번호</b>를 입력하세요.
        </Typography>
        <form action="#" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="이메일"
            placeholder="example@gmail.com"
            sx={{ mb: 2 }}
            onChange={(e) => setId(e.target.value)}
            value={id}
            error={errorId}
            helperText={errorId && `올바른 이메일 형식이 아니거나 입력란이 비었어요.`}
          />
          <TextField
            fullWidth
            type="password"
            label="비닐번호"
            placeholder="password"
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={errorPassword}
            helperText={`8~20자 이내의 영문 대소문자,숫자 그리고 다음 특수문자를 포함하여 입력하세요: ~ ! @ # ^ * ?`}
          />
          <Button type="submit" fullWidth variant="contained" size="large">
            로그인
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Aller.gy에 처음이세요?{' '}
          <Link component={RouterLink} to="/register">
            계정 만들기
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
