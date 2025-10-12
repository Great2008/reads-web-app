import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <h1>Welcome to $READS</h1>
      <p>Study. Learn. Earn. A blockchain-inspired education platform that rewards you for learning.</p>
      <Link to="/learn" className="btn">Start Learning</Link>
    </div>
  );
}