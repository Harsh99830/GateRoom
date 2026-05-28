import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Waiting from './pages/Waiting';
import Call from './pages/Call';
import Auth from './pages/Auth';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
        <Route path="/waiting" element={<ProtectedRoute><Waiting /></ProtectedRoute>} />
        <Route path="/call/:roomId" element={<ProtectedRoute><Call /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
