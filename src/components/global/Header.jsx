import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import CoronavirusRoundedIcon from '@mui/icons-material/CoronavirusRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useRecoilState } from 'recoil';
import { authState } from '../../stores/auth/atom';
import { toast } from 'react-hot-toast';
import { SCREEN_MIN_WIDTH } from '../../App';

/**
 *
 * @param {{activated:boolean, children?:React.ReactNode, onClick:() => void}} props pass imported icon through children
 */
const SingleMenu = (props) => {
  const { activated, children, onClick } = props;
  return (
    <Box sx={{ display: 'inline-block', width: 'calc(100% / 4 - 28px)' }}>
      <IconButton
        size="large"
        onClick={onClick}
        sx={{ width: 60, height: 60 }}
        color={activated ? 'primary' : 'default'}
      >
        {children}
      </IconButton>
    </Box>
  );
};

const Header = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const location = useLocation();

  const [auth, setAuth] = useRecoilState(authState);

  /**
   *
   * @param {string} to relative path
   */
  const hopTo = (to) => {
    !auth.isSignedIn && toast('로그인 후에 이용하세요.');
    return auth.isSignedIn ? to : '/login';
  };

  // useEffect(() => {
  //   console.log(location.pathname);
  // }, [location]);

  return (
    <>
      <Box
        zIndex={zIndex.appBar}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          minWidth: SCREEN_MIN_WIDTH,
          width: '100vw',
          height: 60,
          boxShadow: `0 -3px 64px rgba(0,0,0,0.16)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'white',
        }}
      >
        <Box
          component={RouterLink}
          to={auth.isSignedIn ? '/scan' : '/login'}
          onClick={() => hopTo('/scan')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 112,
            height: 72,
            background: `linear-gradient(315deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <DocumentScannerIcon sx={{ width: 48, height: 48, color: '#fafafa' }} />
        </Box>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <SingleMenu activated={location.pathname === '/'} onClick={() => navigate(hopTo('/'))}>
            <HomeRoundedIcon sx={{ width: 32, height: 32 }} />
          </SingleMenu>
          <SingleMenu activated={location.pathname.includes('/diary')} onClick={() => navigate(hopTo('/diary'))}>
            <NoteAltRoundedIcon sx={{ width: 32, height: 32 }} />
          </SingleMenu>
          <Box sx={{ display: 'inline-block', width: 112 }}></Box>
          <SingleMenu activated={location.pathname.includes('/profile')} onClick={() => navigate(hopTo('/profile'))}>
            <ContactsIcon sx={{ width: 32, height: 32 }} />
          </SingleMenu>
          <SingleMenu
            activated={
              (auth.isSignedIn && location.pathname.includes('/account')) ||
              (!auth.isSignedIn && location.pathname.includes('/login'))
            }
            onClick={() => {
              return auth.isSignedIn ? navigate('/account') : navigate('/login');
            }}
          >
            <AccountCircleRoundedIcon sx={{ width: 32, height: 32 }} />
          </SingleMenu>
        </Box>
      </Box>
    </>
  );
};

export default Header;
