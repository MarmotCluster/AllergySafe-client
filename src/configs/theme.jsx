import { createTheme } from '@mui/material';
import { grey, orange, red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  typography: {
    // fontFamily: "'Noto Serif KR', serif",
    // fontFamily: "'Orbit', sans-serif",
    fontFamily: "'SamsungOne', Courier",
  },
  palette: {
    background: {
      default: '#ffffff',
    },
    primary: {
      main: '#5A2AA4',
    },
    secondary: {
      main: '#D89EFF',
    },
    warning: {
      main: orange[400],
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
