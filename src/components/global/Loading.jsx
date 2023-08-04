import { Backdrop, CircularProgress } from '@mui/material';
import React from 'react';
import { useRecoilState } from 'recoil';
import { globalState } from '../../stores/global/atom';

const Loading = () => {
  const [global, setGlobal] = useRecoilState(globalState);

  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={global.loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
