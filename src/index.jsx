import ReactDOM from 'react-dom/client';
import App from './App';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './configs/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
