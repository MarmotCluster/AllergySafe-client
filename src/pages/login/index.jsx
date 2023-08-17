import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useRecoilState } from 'recoil';
import { globalState } from '../../stores/global/atom';
import { toast } from 'react-hot-toast';
import server from '../../configs/server';
import API from '../../configs/API';
import axios from 'axios';
import Logo from '../../components/auth/Logo';

const Login = () => {
  /* hooks */
  const navigate = useNavigate();
  const { login, requestReset } = useAuth();

  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);

  /* states */
  const [id, setId] = useState('example@example.com');
  const [password, setPassword] = useState('abcd1234@');
  const [errorId, setErrorId] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);

  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState('');

  /* functions */

  /**
   *
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    let hasError = false;
    e.preventDefault();

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
      if (result.status >= 400) {
        toast.error(result.data.message);
      } else {
        toast('어서오세요 !');
        navigate('/', { replace: true });
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  const handleRequestEmail = async () => {
    function isValidEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }

    if (email.length === 0 || !isValidEmail(email)) {
      setErrorEmail(true);
      return;
    }
    setErrorEmail(false);

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await requestReset(email);
      if (res.status >= 400) {
        toast.error(res.data.message);
      } else {
        toast(res.data.message);
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  /* render */

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
        <Box sx={{ textAlign: 'center', pb: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              backgroundImage: `url('${process.env.PUBLIC_URL}/colored.svg')`,
              backgroundSize: 'cover',
              display: 'inline-block',
            }}
          ></Box>
        </Box>
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
        <Box
          sx={{
            mt: Number(forgot) * 2,
            pt: Number(forgot),
            height: Number(forgot) * 150,
            overflow: 'hidden',
            transition: 'height .2s ease, padding .2s ease, margin .2s ease',
          }}
        >
          <TextField
            fullWidth
            type="email"
            label="이메일"
            placeholder="example@gmail.com"
            sx={{ mb: 2 }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={errorEmail}
            helperText={errorEmail && `올바른 이메일 형식이 아니거나 입력란이 비었어요.`}
          />
          <Button variant="outlined" fullWidth size="large" onClick={handleRequestEmail}>
            이메일 보내기
          </Button>
        </Box>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2, color: '#ccc', fontSize: 12 }}>
          비밀번호를 잊으셨나요?{' '}
          <Link sx={{ cursor: 'pointer' }} component="button" onClick={() => setForgot((v) => !v)}>
            초기화하기
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
