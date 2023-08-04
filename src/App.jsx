import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './components/global/AuthContext';
import Home from './pages/home';
import navigation from './router/navigation';
import Header from './components/global/Header';
import { Container, Box } from '@mui/material';
import Loading from './components/global/Loading';
import zIndex from '@mui/material/styles/zIndex';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <Loading />
      <AuthContext />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {navigation.map(({ path, element }, index) => {
          return <Route {...{ key: index, path, element }} />;
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
