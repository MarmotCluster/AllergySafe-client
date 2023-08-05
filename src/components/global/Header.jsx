import { Box, IconButton } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';
import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NoteAltRoundedIcon from '@mui/icons-material/NoteAltRounded';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import CoronavirusRoundedIcon from '@mui/icons-material/CoronavirusRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useRecoilState } from 'recoil';
import { authState } from '../../stores/auth/atom';

/**
 *
 * @param {{activated:boolean, children?:React.ReactNode, onClick:() => void}} props pass imported icon through children
 */
const SingleMenu = (props) => {
  const { activated, children, onClick } = props;
  return (
    <Box sx={{ display: 'inline-block', width: 'calc(100% / 4 - 28px)', minWidth: 70 }}>
      <IconButton size="large" onClick={onClick} sx={{ width: 70, height: 70 }}>
        {children}
      </IconButton>
    </Box>
  );
};

const Header = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  return (
    <>
      <Box
        zIndex={zIndex.appBar}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          minWidth: 400,
          width: '100vw',
          height: 74,
          boxShadow: `0 -3px 64px rgba(0,0,0,0.16)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'white',
        }}
      >
        <Box
          component={RouterLink}
          to="/scan"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 112,
            height: 86,
            background: 'linear-gradient(315deg, rgba(216,158,255,1) 0%, rgba(90,42,164,1) 100%)',
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            borderRadius: '14px 14px 0 0',
          }}
        >
          <DocumentScannerIcon sx={{ width: 48, height: 48, color: '#fafafa' }} />
        </Box>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <SingleMenu onClick={() => navigate('/')}>
            <HomeRoundedIcon fontSize="large" />
          </SingleMenu>
          <SingleMenu onClick={() => navigate('/diary')}>
            <NoteAltRoundedIcon fontSize="large" />
          </SingleMenu>
          <Box sx={{ display: 'inline-block', width: 112 }}></Box>
          <SingleMenu onClick={() => navigate('/profile')}>
            <CoronavirusRoundedIcon fontSize="large" />
          </SingleMenu>
          <SingleMenu
            onClick={() => {
              // return auth.isSignedIn ? navigate('/account') : navigate('/login');
              return auth.isSignedIn ? navigate('/login') : navigate('/account');
            }}
          >
            <AccountCircleRoundedIcon fontSize="large" />
          </SingleMenu>
        </Box>
      </Box>
    </>
  );
};

export default Header;
