import { Avatar, Box, Button, Card, CardContent, Container, Link, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authState } from '../../stores/auth/atom';
import { toast } from 'react-hot-toast';
import { globalState } from '../../stores/global/atom';

const Account = () => {
  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);
  const { userData } = useRecoilValue(authState);

  /* hooks */
  const navigate = useNavigate();

  const { logout, changePassword } = useAuth();

  /* states */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState({
    currentPassword: false,
    newPassword: false,
    confirm: false,
  });

  /* functions */
  const handleSubmit = async () => {
    let hasError = {
      currentPassword: false,
      newPassword: false,
      confirm: false,
    };

    if (currentPassword.length === 0) {
      hasError.currentPassword = true;
    }

    if (newPassword.length === 0 || !/^(?=.*[a-zA-Z])(?=.*[~!@#^*?])(?=.*[0-9]).{8,20}$/.test(newPassword)) {
      hasError.newPassword = true;
    }

    if (confirm.length === 0 || confirm !== newPassword) {
      hasError.confirm = true;
    }

    setError({ ...hasError });
    if (!Object.values(hasError).every((i) => !i)) return;

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await changePassword({ currentPassword, newPassword });
      if (res.status >= 400) {
        toast.error(res.data.message);
      } else if (String(res.status)[0] === '2') {
        console.log(res);
        setCurrentPassword('');
        setNewPassword('');
        setConfirm('');
        toast('비밀번호가 변경되었어요.');
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar />
            <Box sx={{ ml: 2 }}>
              <Typography fontWeight="bold">{userData?.name ? userData.name : '...'}</Typography>
              <Link
                variant="body2"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                로그아웃
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 5 }}>
        <Typography>비밀번호 바꾸기</Typography>
        <Typography variant="body2">정기적으로 보안 관리를 하세요.</Typography>
        <Box sx={{ '& > *:not(:first-child)': { mt: 1 }, mt: 2 }}>
          <TextField
            type="password"
            fullWidth
            size="small"
            label="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={error.currentPassword}
          />
          <TextField
            type="password"
            fullWidth
            size="small"
            label="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText={`8~20자 이내의 영문 대소문자,숫자 그리고 다음 특수문자를 포함하여 입력하세요: ~ ! @ # ^ * ?`}
            error={error.newPassword}
          />
          <TextField
            type="password"
            fullWidth
            size="small"
            label="새 비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            helperText={'새 비밀번호와 동일하게 작성하세요.'}
            error={error.confirm}
          />
          <Button fullWidth size="medium" variant="contained" onClick={handleSubmit}>
            저장하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Account;