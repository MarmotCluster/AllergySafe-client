import { Box } from '@mui/material';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './components/global/AuthContext';
import Header from './components/global/Header';
import Loading from './components/global/Loading';
import Home from './pages/home';
import navigation from './router/navigation';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            border: 'none',
            borderRadius: 100,
            userSelect: 'none',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0,0,0,0.4)',
            color: 'white',
          },
        }}
      />
      <Loading />
      <AuthContext />
      <Box sx={{ minWidth: 400, position: 'relative', height: '100vh' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {navigation.map(({ path, element }, index) => {
            return <Route {...{ key: index, path, element }} />;
          })}
        </Routes>
      </Box>
    </BrowserRouter>
  );
};

export default App;
