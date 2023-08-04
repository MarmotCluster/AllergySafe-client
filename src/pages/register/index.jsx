import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useRecoilState } from 'recoil';
import { globalState } from '../../stores/global/atom';
import { toast } from 'react-hot-toast';

const Register = () => {
  /* hooks */
  const { login, register } = useAuth();

  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);

  /* states */
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState({
    username: false,
    email: false,
    password: false,
    confirm: false,
  });

  /* functions */

  /**
   *
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    let hasError = { username: false, email: false, password: false, confirm: false };

    e.preventDefault();
    // console.log({ username, email, password, confirm });

    if (!username) hasError.username = true;
    if (!email) hasError.email = true;
    if (!password || !/^(?=.*[a-zA-Z])(?=.*[~!@#^*?])(?=.*[0-9]).{8,20}$/.test(password)) hasError.password = true;
    if (!confirm || confirm !== password) hasError.confirm = true;

    if (!Object.values(hasError).every((i) => !i)) {
      console.log(hasError);
      setError({ ...hasError });
      return;
    }

    setError({
      username: false,
      email: false,
      password: false,
      confirm: false,
    });

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const result = await register({ username, email, password, passwordcheck: confirm });
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
          아래 <b>양식</b>을 작성하세요.
        </Typography>
        <form action="#" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="text"
            label="사용자이름"
            placeholder="홍길동"
            sx={{ mb: 2 }}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            error={error.username}
          />
          <TextField
            fullWidth
            type="email"
            label="이메일"
            placeholder="example@gmail.com"
            sx={{ mb: 2 }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={error.email}
          />
          <TextField
            fullWidth
            type="password"
            label="비닐번호"
            placeholder="password"
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={error.password}
            helperText={`8~20자 이내의 영문 대소문자,숫자 그리고 다음 특수문자를 포함하여 입력하세요: ~ ! @ # ^ * ?`}
          />
          <TextField
            fullWidth
            type="password"
            label="비닐번호 확인"
            placeholder="password"
            sx={{ mb: 2 }}
            onChange={(e) => setConfirm(e.target.value)}
            value={confirm}
            error={error.confirm}
          />
          <Button type="submit" fullWidth variant="contained" size="large">
            가입하기
          </Button>
        </form>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          이미 계정이 있나요?{' '}
          <Link component={RouterLink} to="/login">
            로그인하기
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
