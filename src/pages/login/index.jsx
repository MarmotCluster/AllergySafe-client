import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Login = () => {
  /* states */
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  /* functions */

  /**
   *
   * @param {React.FormEvent} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ id, password });
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
            label="사용자이름"
            placeholder="example@gmail.com"
            sx={{ mb: 2 }}
            onChange={(e) => setId(e.target.value)}
            value={id}
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
