import { Container, Box, TextField, Button } from '@mui/material';
import React, { useState } from 'react';
import Html5QrcodePlugin from '../../components/scan/Html5QrcodePlugin';
import ResultContainerPlugin from '../../components/scan/ResultContainerPlugin';
import { useRecoilState } from 'recoil';
import { globalState } from '../../stores/global/atom';
import { toast } from 'react-hot-toast';
import useScan from '../../hooks/useScan';

const Scan = () => {
  /* hooks */
  const { search } = useScan();

  /* stores */
  const [global, setGlobal] = useRecoilState(globalState);

  /* states */
  const [decodedResults, setDecodedResults] = useState([]);
  const [serial, setSerial] = useState('');
  const [error, setError] = useState({ serial: false });

  /* functions */
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log('Scan [result]', decodedResult);
    setDecodedResults((prev) => [...prev, decodedResult]);
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

  return (
    <Container>
      <Box height={`calc(100vh - 240px)`}>
        <Html5QrcodePlugin fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} />
        <ResultContainerPlugin results={decodedResults} />
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
        <Button variant="contained" size="large" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
          검색하기
        </Button>
      </Box>
    </Container>
  );
};

export default Scan;
