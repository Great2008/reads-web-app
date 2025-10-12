import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmailPassword, signInWithEmail } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'register') {
        await registerWithEmailPassword(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>{mode === 'register' ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">{mode === 'register' ? 'Register' : 'Login'}</button>
      </form>
      <p>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </p>
    </div>
  );
}