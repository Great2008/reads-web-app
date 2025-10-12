import React from 'react';
import { Link } from 'react-router-dom';

export default function NavBar({ user, userDoc, onLogout }) {
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, alignItems: 'center', borderBottom: '1px solid #eee' }}>
      <div style={{ fontWeight: 700 }}>$READS</div>
      <Link to="/">Home</Link>
      <Link to="/learn">Learn</Link>
      <Link to="/earn">Earn</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <>
            <span style={{ marginRight: 8 }}>{user.email}</span>
            <Link to="/admin" style={{ marginRight: 8 }}>Admin</Link>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login / Register</Link>
        )}
      </div>
    </nav>
  );
}