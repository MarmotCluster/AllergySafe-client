import * as React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import navigation from './router/navigation';
import AuthContext from './components/global/AuthContext';

export default function App() {
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
}
