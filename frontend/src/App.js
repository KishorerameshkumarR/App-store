import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OpenPage from './pages/OpenPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OpenPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/app/:id" element={<AppPage />} />
      </Routes>
    </Router>
  );
}

export default App;
