import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = 'html5qr-code-full-region';

// Creates the configuration object for Html5QrcodeScanner.
/**
 * @typedef {Object} ScanProps
 * @property {number} fps
 * @property {number} qrbox
 * @property {boolean} disableFlip
 * @property {(decodedText:string, decodedResult:unknown) => void} qrCodeSuccessCallback
 */

/**
 * @param {ScanProps} props
 */
const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

/**
 *
 * @param {ScanProps} props
 * @returns {React.JSX.Element}
 */
const Html5QrcodePlugin = (props) => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw 'qrCodeSuccessCallback is required callback.';
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error('Failed to clear html5QrcodeScanner. ', error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
