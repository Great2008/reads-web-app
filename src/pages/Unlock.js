import React, { useContext, useState } from 'react';
import { TokenContext } from '../components/TokenContext';

export default function Unlock() {
  const { tokens, spendTokens } = useContext(TokenContext);
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => {
    if (tokens >= 10) {
      spendTokens(10);
      setUnlocked(true);
    } else {
      alert('Not enough $READS tokens!');
    }
  };

  return (
    <div className="page">
      <h2>Premium Content</h2>
      {unlocked ? (
        <p>✅ Access granted! Premium study material: “Advanced Fractions Practice”</p>
      ) : (
        <>
          <p>Unlock premium lessons for 10 $READS tokens.</p>
          <button onClick={handleUnlock}>Unlock Now</button>
        </>
      )}
    </div>
  );
}