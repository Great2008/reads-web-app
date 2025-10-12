import React, { useContext } from 'react';
import { TokenContext } from '../components/TokenContext';

export default function Wallet() {
  const { tokens } = useContext(TokenContext);

  return (
    <div className="page">
      <h2>Wallet</h2>
      <p>Current Balance: 💰 {tokens} $READS</p>
      <p>Use your tokens to unlock premium educational resources.</p>
    </div>
  );
}