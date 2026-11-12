
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import Home from './pages/Home';
import Nutrition from './pages/Nutrition';
import Tracker from './pages/Tracker';
import Workouts from './pages/Workouts';
import Contact from './pages/Contact';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('nutrigenLoggedIn') === 'true'
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    localStorage.removeItem('nutrigenLoggedIn');
    localStorage.removeItem('nutrigenUser');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar onLogout={handleLogout} />

          <main style={{ flex: '1 0 auto' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
