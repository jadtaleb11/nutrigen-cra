
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem('nutrigenLoggedIn', 'true');
    localStorage.setItem('nutrigenUser', email || 'Guest');

    onLogin();
    navigate('/');
  };

  const handleGuestLogin = () => {
    localStorage.setItem('nutrigenLoggedIn', 'true');
    localStorage.setItem('nutrigenUser', 'Guest');

    onLogin();
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-glow"></div>
      </div>

      <div className="login-card">
        <div className="login-brand">
          <h1>
            Nutri<span>Gen</span><b>.</b>
          </h1>
          <p>YOUR PERFORMANCE. YOUR POTENTIAL.</p>
        </div>

        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your performance journey.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            LOGIN
            <span>→</span>
          </button>
        </form>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="guest-btn"
          onClick={handleGuestLogin}
        >
          FAST LOGIN AS GUEST
          <span>↗</span>
        </button>

        <p className="login-footer">
          BUILT FOR PERFORMANCE. DESIGNED FOR ATHLETES.
        </p>
      </div>
    </div>
  );
}

export default Login;
