import '../../types';
import {
  Container,
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Avatar,
  Checkbox,
} from '@mui/material';
import React, { useState } from 'react';
import Html5QrcodePlugin from '../../components/scan/Html5QrcodePlugin';
import ResultContainerPlugin from '../../components/scan/ResultContainerPlugin';
import { useRecoilState } from 'recoil';
import { globalState } from '../../stores/global/atom';
import { toast } from 'react-hot-toast';
import useScan from '../../hooks/useScan';

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useNavigate } from 'react-router-dom';
import useList from '@mui/base/useList/useList';
import { friendListState } from '../../stores/lists/friends';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Scan = () => {
  /* hooks */
  const navigate = useNavigate();
  const { search } = useScan();

  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);
  const [friends, setFriends] = useRecoilState(friendListState);

  /* states */
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(() => new Set());
  // const [/**@type {FriendList[]} */ friends, setFriends] = useState([
  //   {
  //     category: '나',
  //     items: [
  //       {
  //         id: 0,
  //         profileImage: null,
  //         name: '나님',
  //       },
  //     ],
  //   },
  //   {
  //     category: '까떼고리 0',
  //     items: [
  //       {
  //         id: 1,
  //         profileImage: null,
  //         name: '감바스',
  //       },
  //       {
  //         id: 2,
  //         profileImage: null,
  //         name: '나일론',
  //       },
  //     ],
  //   },
  // ]);

  const [decodedResults, setDecodedResults] = useState([]);

  const [isMedicine, setIsMedicine] = useState(false);
  const [serial, setSerial] = useState('');
  const [error, setError] = useState({ serial: false });

  /* functions */

  /**
   *  close popup
   */
  const handleClose = () => {
    setOpen(false);
    if (selected.size === 0) {
      navigate(-1);
    }
  };

  /**
   *
   * @param {string} decodedText
   * @param {unknown} decodedResult
   */
  const onNewScanResult = (decodedText, decodedResult) => {
    setDecodedResults((prev) => [...prev, decodedResult]);
    setSerial(decodedText);
  };

  const handleSubmit = async () => {
    let hasError = { serial: false };
    if (!serial) {
      hasError.serial = true;
    }

    if (!Object.values(hasError).every((i) => !i)) {
      setError({ ...hasError });
      return;
    }

    setError({ serial: false });

    try {
      setGlobal((v) => ({ ...v, loading: true }));
      const res = await search(serial);
    } catch (err) {
      toast.error('나중에 다시 시도하세요.');
    } finally {
      setGlobal((v) => ({ ...v, loading: false }));
    }
  };

  /* renders */
  const renderList = () => {
    return friends.map((item, index) => {
      const { category, items } = item;

      return (
        <React.Fragment key={index}>
          <Typography variant="body2" sx={{ mt: index > 0 && 2 }}>
            {category}
          </Typography>

          {items.map((jtem, jndex) => {
            const { id, profileImage, name } = jtem;

            return (
              <Box key={jndex} sx={{ display: 'flex', my: 2, justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center">
                  <Avatar src={profileImage && profileImage} />
                  <Typography variant="body" sx={{ ml: 2 }}>
                    {name}
                  </Typography>
                </Box>
                <Checkbox
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<RadioButtonCheckedIcon />}
                  checked={selected.has(id)}
                  onChange={(e) =>
                    setSelected((v) => {
                      const next = new Set(v);
                      const checked = next.has(id);
                      !checked ? next.add(id) : next.delete(id);
                      return next;
                    })
                  }
                />
              </Box>
            );
          })}

          <Divider />
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <Container>
        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={() => setOpen(true)} disabled={open}>
          {`검사할 사람 (${selected.size})...`}
        </Button>
        <Box>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" onChange={(e) => setIsMedicine(e.target.checked)} value={isMedicine} />}
            label="의약품"
            labelPlacement="start"
          />
        </Box>
        <Box sx={{ minHeight: 'calc(100vh - 240px)' }}>
          <Html5QrcodePlugin fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} />
          {/* <ResultContainerPlugin results={decodedResults} /> */}
        </Box>
        <Box>
          <TextField
            fullWidth
            label="코드"
            placeholder="카메라로 스캔하거나 여기에 직접 입력하세요."
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            error={error.serial}
            helperText={error.serial && `카메라로 스캔하거나 여기에 직접 입력하세요.`}
          />
          <Button variant="contained" size="large" fullWidth sx={{ mt: 2, mb: 5 }} onClick={handleSubmit}>
            검색하기
          </Button>
        </Box>
        <Box height={80} />
      </Container>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={selected.size > 0 && handleClose}
        fullWidth
      >
        <DialogTitle>
          <span>{'검사할 사람'}</span>
          <Typography variant="body2">최소 한명 이상을 선택하세요.</Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ minHeight: `calc(100vh - 200px)` }}>{renderList()}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} fullWidth variant="contained">
            {selected.size === 0 ? '뒤로가기' : `선택완료 (${selected.size})`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Scan;
