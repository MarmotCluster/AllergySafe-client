import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Register = () => {
  /* states */
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  /* functions */

  /**
   *
   * @param {React.FormEvent} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ username, email, password, confirm });
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
          />
          <TextField
            fullWidth
            type="email"
            label="이메일"
            placeholder="example@gmail.com"
            sx={{ mb: 2 }}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            fullWidth
            type="password"
            label="비닐번호"
            placeholder="password"
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <TextField
            fullWidth
            type="password"
            label="비닐번호 확인"
            placeholder="password"
            sx={{ mb: 2 }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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
