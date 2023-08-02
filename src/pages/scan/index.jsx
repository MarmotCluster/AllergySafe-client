import React, { useState } from 'react';
import Html5QrcodePlugin from '../../components/Html5QrcodePlugin';
import ResultContainerPlugin from '../../components/ResultContainerPlugin';

const Scan = () => {
  const [decodedResults, setDecodedResults] = useState([]);
  const onNewScanResult = (decodedText, decodedResult) => {
    console.log('Scan [result]', decodedResult);
    setDecodedResults((prev) => [...prev, decodedResult]);
  };

  return (
    <div>
      <Html5QrcodePlugin fps={10} qrbox={250} disableFlip={false} qrCodeSuccessCallback={onNewScanResult} />
      <ResultContainerPlugin results={decodedResults} />
    </div>
  );
};

export default Scan;
