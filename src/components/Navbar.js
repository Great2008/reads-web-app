import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TokenContext } from './TokenContext';

export default function Navbar() {
  const { tokens } = useContext(TokenContext);

  return (
    <nav className="navbar">
      <h2>$READS PoC</h2>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/wallet">Wallet</Link>
        <Link to="/unlock">Unlock</Link>
      </div>
      <p className="balance">💰 {tokens} $READS</p>
    </nav>
  );
}