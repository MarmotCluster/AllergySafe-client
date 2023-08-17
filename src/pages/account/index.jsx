import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authState } from '../../stores/auth/atom';
import { toast } from 'react-hot-toast';
import { globalState } from '../../stores/global/atom';

import PersonOffIcon from '@mui/icons-material/PersonOff';

const Account = () => {
  /* stores */

  const theme = useTheme();

  const [global, setGlobal] = useRecoilState(globalState);
  const { userData } = useRecoilValue(authState);

  /* hooks */
  const navigate = useNavigate();

  const { logout, changePassword, withdraw } = useAuth();

  /* states */
  const [open, setOpen] = useState(false);
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

  const handleWithdraw = async () => {
    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await withdraw();
      if (res.status >= 400) {
        toast.error(res.data.message);
      } else if (String(res.status)[0] === '2') {
        toast('이용해 주셔서 감사합니다.');
        logout();
        navigate('/login');
      }
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Card sx={{ borderRadius: 5 }}>
          <CardHeader
            sx={{
              p: 1,
              background: `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          ></CardHeader>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={userData?.imageUrl} />
              <Box sx={{ ml: 2 }}>
                <Typography fontWeight="bold">{userData?.name ? userData.name : '...'}</Typography>
                <Typography variant="body2">{userData?.email}</Typography>
                <Link
                  variant="body2"
                  onClick={() => {
                    logout();
                    navigate('/login');
                    toast('로그아웃 되었어요.');
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

          <Card sx={{ borderRadius: 5 }}>
            <CardHeader
              sx={{
                p: 1,
                background: `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              }}
            ></CardHeader>
            <CardContent>
              <Typography>비밀번호 바꾸기</Typography>
              <Typography variant="body2">정기적으로 보안 관리를 하세요.</Typography>
              <Box sx={{ '& > *:not(:first-child)': { mt: 1 }, mt: 2 }}>
                <TextField
                  type="password"
                  fullWidth
                  // size="small"
                  label="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  error={error.currentPassword}
                />
                <TextField
                  type="password"
                  fullWidth
                  // size="small"
                  label="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText={`8~20자 이내의 영문 대소문자,숫자 그리고 다음 특수문자를 포함하여 입력하세요: ~ ! @ # ^ * ?`}
                  error={error.newPassword}
                />
                <TextField
                  type="password"
                  fullWidth
                  // size="small"
                  label="새 비밀번호 확인"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  helperText={'새 비밀번호와 동일하게 작성하세요.'}
                  error={error.confirm}
                />
                <Button fullWidth size="large" variant="contained" onClick={handleSubmit}>
                  저장하기
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button fullWidth onClick={() => setOpen(true)}>
            계정 탈퇴하기
          </Button>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            더 이상 우리의 서비스를 이용하지 않으려면 탈퇴를 누르세요. 이 과정은 되돌릴 수 없어요.
          </Typography>
        </Box>
      </Box>

      <Dialog open={open} fullWidth>
        <DialogTitle>계정 삭제 확인</DialogTitle>
        <DialogContent>이 과정은 되돌릴 수 없어요.</DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<PersonOffIcon />}
            disabled={global.loading}
            onClick={handleWithdraw}
          >
            탈퇴하기
          </Button>
          <Button fullWidth onClick={() => setOpen(false)} disabled={global.loading}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Account;
