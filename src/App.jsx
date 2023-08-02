import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthContext from './components/global/AuthContext';
import Home from './pages/home';
import navigation from './router/navigation';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <AuthContext />
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
