import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Waiting from './pages/Waiting';
import Call from './pages/Call';
import Auth from './pages/Auth';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />
          <Route path="/waiting" element={<ProtectedRoute><Waiting /></ProtectedRoute>} />
          <Route path="/call/:roomId" element={<ProtectedRoute><Call /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
